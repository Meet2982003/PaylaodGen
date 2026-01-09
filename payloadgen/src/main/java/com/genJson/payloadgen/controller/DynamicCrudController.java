package com.genJson.payloadgen.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.genJson.payloadgen.service.GenericCrudService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/crud")
public class DynamicCrudController {

    private final GenericCrudService crudService;

    public DynamicCrudController(GenericCrudService crudService) {
        this.crudService = crudService;
    }

    @PostMapping("/create_or_update")
    public ResponseEntity<?> createOrUpdate(@RequestBody Object payload) {
        try {
            Map<String, Object> processedPayload = preparePayload(payload);
            Object result = crudService.saveOrUpdate(processedPayload);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "status", "failed"));
        }
    }

    @GetMapping("/read")
    public ResponseEntity<?> read(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(crudService.findById(payload));
    }

    @PostMapping("/find_all")
    public ResponseEntity<?> findAll(@RequestBody Map<String, Object> payload) {
        try {
            Object result = crudService.findAll(payload);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage(),
                    "status", "failed"));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(crudService.delete(payload));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> preparePayload(Object payload) {
        if (payload instanceof Map) {
            return (Map<String, Object>) payload;
        } else if (payload instanceof List) {
            // If it's a list, wrap it in a map with "data" key
            return Map.of("data", payload);
        } else {
            throw new IllegalArgumentException("Invalid payload format. Expected a JSON object or array.");
        }
    }
}

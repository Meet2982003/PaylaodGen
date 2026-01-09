package com.genJson.payloadgen.service;

import java.util.Map;

public interface GenericCrudService {
    Object saveOrUpdate(Map<String, Object> payload);

    Object findById(Map<String, Object> payload);

    Object delete(Map<String, Object> payload);

    Object findAll(Map<String, Object> payload);
}

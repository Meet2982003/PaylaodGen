package com.genJson.payloadgen.service.serviceImpl;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genJson.payloadgen.service.EntityRegistry;
import com.genJson.payloadgen.service.GenericCrudService;

@Service
public class GenericCrudServiceImpl implements GenericCrudService {

    private final EntityRegistry registry;
    private final ObjectMapper mapper;

    public GenericCrudServiceImpl(EntityRegistry registry, ObjectMapper mapper) {
        this.registry = registry;
        this.mapper = mapper;
    }

    // 🔹 Create or Update (handles both single and batch)
    @SuppressWarnings("unchecked")
    @Override
    public Object saveOrUpdate(Map<String, Object> payload) {
        String entityName = (String) payload.get("entity");
        Object data = payload.get("data");

        // If no "data" key exists, treat the entire payload as data
        // (excluding "entity" key if present)
        if (data == null) {
            data = new HashMap<>(payload);
            ((Map<String, Object>) data).remove("entity");
        }

        JpaRepository<?, ?> repo;
        Class<?> entityClass;

        // Determine entity dynamically
        if (entityName != null) {
            entityClass = registry.getEntityClass(entityName);
            repo = registry.getRepository(entityName);
        } else {
            Map<String, Object> dataMap = extractFirstMap(data);
            entityClass = registry.guessEntityByPayload(dataMap);
            repo = registry.getRepositoryByEntity(entityClass);
        }

        if (entityClass == null || repo == null) {
            throw new IllegalArgumentException("Unknown or unregistered entity type");
        }

        // Handle list or single object
        if (data instanceof List<?>) {
            List<?> dataList = (List<?>) data;
            List<Object> saved = new ArrayList<>();
            for (Object item : dataList) {
                Map<String, Object> map = (Map<String, Object>) item;
                Object entity = mapToEntity(map, entityClass);
                saved.add(saveOrUpdateEntity(repo, entity, entityClass));
            }
            return saved;
        } else if (data instanceof Map) {
            Object entity = mapToEntity((Map<String, Object>) data, entityClass);
            return saveOrUpdateEntity(repo, entity, entityClass);
        } else {
            throw new IllegalArgumentException("Invalid data format. Expected an object or list of objects.");
        }
    }

    // 🔹 Handles create vs update logic safely
    @SuppressWarnings("unchecked")
    private Object saveOrUpdateEntity(JpaRepository<?, ?> repo, Object entity, Class<?> entityClass) {
        try {
            Field idField = getIdField(entityClass);
            idField.setAccessible(true);
            Object idValue = idField.get(entity);

            JpaRepository<Object, Object> genericRepo = (JpaRepository<Object, Object>) repo;

            if (idValue != null) {
                Object convertedId = convertIdType(idValue, entityClass);
                Optional<Object> existing = genericRepo.findById(convertedId);
                if (existing.isPresent()) {
                    Object existingEntity = existing.get();
                    copyNonNullProperties(entity, existingEntity);
                    return genericRepo.save(existingEntity);
                }
            }

            return genericRepo.save(entity);
        } catch (Exception e) {
            throw new RuntimeException("Error saving or updating entity: " + e.getMessage(), e);
        }
    }

    // 🔹 Merge only non-null fields during update
    private void copyNonNullProperties(Object src, Object target) throws IllegalAccessException {
        for (Field field : src.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            Object value = field.get(src);
            if (value != null) {
                field.set(target, value);
            }
        }
    }

    // 🔹 Find by ID (auto-detects ID type)
    @SuppressWarnings("unchecked")
    @Override
    public Object findById(Map<String, Object> payload) {
        var entityContext = resolveEntityContext(payload);
        Object id = payload.get("id");
        if (id == null) {
            throw new IllegalArgumentException("Missing 'id' for find operation");
        }

        JpaRepository<Object, Object> repo = (JpaRepository<Object, Object>) entityContext.repo();
        Object idValue = convertIdType(id, entityContext.entityClass());

        return repo.findById(idValue)
                .orElseThrow(() -> new IllegalArgumentException("Record not found for ID: " + id));
    }

    // 🔹 Convert ID to the entity's declared ID type
    private Object convertIdType(Object id, Class<?> entityClass) {
        try {
            Field idField = getIdField(entityClass);
            Class<?> idType = idField.getType();

            if (idType.equals(Long.class) || idType.equals(long.class)) {
                return Long.valueOf(id.toString());
            } else if (idType.equals(Integer.class) || idType.equals(int.class)) {
                return Integer.valueOf(id.toString());
            } else if (idType.equals(String.class)) {
                return id.toString();
            } else {
                throw new IllegalArgumentException("Unsupported ID type: " + idType.getSimpleName());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to determine ID type: " + e.getMessage(), e);
        }
    }

    // 🔹 Find all with pagination support
    @Override
    public Object findAll(Map<String, Object> payload) {
        var entityContext = resolveEntityContext(payload);
        JpaRepository<?, ?> repo = entityContext.repo();

        // Extract pagination parameters
        Integer page = getIntegerValue(payload, "page", 0);
        Integer size = getIntegerValue(payload, "size", 10);
        String sortBy = (String) payload.get("sortBy");
        String sortOrder = (String) payload.get("sortOrder");

        // Validate page and size
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }

        // Create Pageable object
        Pageable pageable;
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort.Direction direction = Sort.Direction.ASC;
            if (sortOrder != null && sortOrder.equalsIgnoreCase("desc")) {
                direction = Sort.Direction.DESC;
            }
            pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }

        // Fetch paginated data
        Page<?> pageData = repo.findAll(pageable);

        // Build response
        return Map.of(
                "status", "success",
                "page", pageData.getNumber(),
                "size", pageData.getSize(),
                "totalElements", pageData.getTotalElements(),
                "totalPages", pageData.getTotalPages(),
                "isFirst", pageData.isFirst(),
                "isLast", pageData.isLast(),
                "hasNext", pageData.hasNext(),
                "hasPrevious", pageData.hasPrevious(),
                "data", pageData.getContent());
    }

    // 🔹 Helper method to safely extract integer values from payload
    private Integer getIntegerValue(Map<String, Object> payload, String key, Integer defaultValue) {
        Object value = payload.get(key);
        if (value == null) {
            return defaultValue;
        }
        if (value instanceof Integer) {
            return (Integer) value;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    // 🔹 Delete (supports single + batch)
    @SuppressWarnings("unchecked")
    @Override
    public Object delete(Map<String, Object> payload) {
        var entityContext = resolveEntityContext(payload);
        JpaRepository<Object, Object> repo = (JpaRepository<Object, Object>) entityContext.repo();

        if (payload.containsKey("ids")) {
            List<?> ids = (List<?>) payload.get("ids");
            if (ids == null || ids.isEmpty()) {
                throw new IllegalArgumentException("The 'ids' list cannot be empty for delete operation");
            }

            List<Object> deletedIds = new ArrayList<>();
            for (Object idObj : ids) {
                Object idValue = convertIdType(idObj, entityContext.entityClass());
                repo.deleteById(idValue);
                deletedIds.add(idValue);
            }

            return Map.of("deleted", true, "count", deletedIds.size(), "ids", deletedIds);
        }

        Object id = payload.get("id");
        if (id == null) {
            throw new IllegalArgumentException("Missing 'id' or 'ids' for delete operation");
        }

        Object idValue = convertIdType(id, entityContext.entityClass());
        repo.deleteById(idValue);

        return Map.of("deleted", true, "id", idValue);
    }

    // --- Helper to resolve entity dynamically
    private EntityContext resolveEntityContext(Map<String, Object> payload) {
        String entityName = (String) payload.get("entity");
        Object data = payload.get("data");

        Class<?> entityClass;
        JpaRepository<?, ?> repo;

        if (entityName != null) {
            entityClass = registry.getEntityClass(entityName);
            repo = registry.getRepository(entityName);
        } else {
            @SuppressWarnings("unchecked")
            Map<String, Object> dataMap = (Map<String, Object>) (data != null ? data : payload);
            entityClass = registry.guessEntityByPayload(dataMap);
            repo = registry.getRepositoryByEntity(entityClass);
        }

        if (entityClass == null || repo == null) {
            throw new IllegalArgumentException("Unknown or unregistered entity type");
        }

        return new EntityContext(entityClass, repo, data != null ? data : payload);
    }

    @SuppressWarnings("rawtypes")
    private record EntityContext(Class<?> entityClass, JpaRepository repo, Object data) {
    }

    // 🔹 Handles mapping of simple + related entities (auto structured/raw
    // detection)
    @SuppressWarnings("unchecked")
    private Object mapToEntity(Map<String, Object> map, Class<?> entityClass) {
        try {
            Object entity = entityClass.getDeclaredConstructor().newInstance();

            for (Map.Entry<String, Object> entry : map.entrySet()) {
                String fieldName = entry.getKey();
                Object value = entry.getValue();

                Field field;
                try {
                    field = entityClass.getDeclaredField(fieldName);
                } catch (NoSuchFieldException e) {
                    continue;
                }

                field.setAccessible(true);
                Class<?> fieldType = field.getType();

                if (isSimpleType(fieldType)) {
                    Object convertedValue = convertToFieldType(value, fieldType);
                    field.set(entity, convertedValue);
                } else if (value instanceof Map<?, ?> nestedMap) {
                    field.set(entity, mapToEntity((Map<String, Object>) nestedMap, fieldType));
                } else if (value instanceof Number || value instanceof String) {
                    JpaRepository<?, ?> relatedRepo = registry.getRepositoryByEntity(fieldType);
                    if (relatedRepo != null) {
                        JpaRepository<Object, Object> genericRepo = (JpaRepository<Object, Object>) relatedRepo;
                        Object idValue = convertIdType(value, fieldType);
                        Object relatedEntity = genericRepo.findById(idValue)
                                .orElseThrow(() -> new IllegalArgumentException(
                                        "Related entity not found for " + fieldName + " with ID " + value));
                        field.set(entity, relatedEntity);
                    }
                } else if (value instanceof List<?> listVal) {
                    List<Object> relatedList = new ArrayList<>();
                    Class<?> genericType = getGenericType(field);
                    for (Object item : listVal) {
                        if (item instanceof Map<?, ?> m) {
                            relatedList.add(mapToEntity((Map<String, Object>) m, genericType));
                        } else {
                            JpaRepository<?, ?> relatedRepo = registry.getRepositoryByEntity(genericType);
                            if (relatedRepo != null) {
                                JpaRepository<Object, Object> genericRepo = (JpaRepository<Object, Object>) relatedRepo;
                                Object idValue = convertIdType(item, genericType);
                                Object relatedEntity = genericRepo.findById(idValue)
                                        .orElseThrow(() -> new IllegalArgumentException(
                                                "Related entity not found for " + fieldName + " ID " + item));
                                relatedList.add(relatedEntity);
                            }
                        }
                    }
                    field.set(entity, relatedList);
                }
            }

            return entity;
        } catch (Exception e) {
            throw new RuntimeException("Error mapping payload to entity: " + e.getMessage(), e);
        }
    }

    // 🔹 Converts value to match field type
    private Object convertToFieldType(Object value, Class<?> targetType) {
        if (value == null) {
            return null;
        }

        if (targetType.isInstance(value)) {
            return value;
        }

        String strValue = value.toString();

        try {
            if (targetType == Long.class || targetType == long.class) {
                return Long.valueOf(strValue);
            } else if (targetType == Integer.class || targetType == int.class) {
                return Integer.valueOf(strValue);
            } else if (targetType == Double.class || targetType == double.class) {
                return Double.valueOf(strValue);
            } else if (targetType == Float.class || targetType == float.class) {
                return Float.valueOf(strValue);
            } else if (targetType == Boolean.class || targetType == boolean.class) {
                return Boolean.valueOf(strValue);
            } else if (targetType == Short.class || targetType == short.class) {
                return Short.valueOf(strValue);
            } else if (targetType == Byte.class || targetType == byte.class) {
                return Byte.valueOf(strValue);
            } else if (targetType == String.class) {
                return strValue;
            } else if (targetType == java.time.LocalDate.class) {
                return java.time.LocalDate.parse(strValue);
            } else if (targetType == java.time.LocalDateTime.class) {
                return java.time.LocalDateTime.parse(strValue);
            }

            return value;
        } catch (NumberFormatException | java.time.format.DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "Cannot convert value '" + value + "' to type " + targetType.getSimpleName(), e);
        }
    }

    private Field getIdField(Class<?> entityClass) {
        return Arrays.stream(entityClass.getDeclaredFields())
                .filter(f -> f.getName().equalsIgnoreCase("id"))
                .findFirst()
                .orElseThrow(
                        () -> new IllegalArgumentException("No 'id' field found in " + entityClass.getSimpleName()));
    }

    private boolean isSimpleType(Class<?> type) {
        return type.isPrimitive()
                || type.equals(String.class)
                || Number.class.isAssignableFrom(type)
                || type.equals(Boolean.class)
                || type.equals(java.time.LocalDate.class)
                || type.equals(java.time.LocalDateTime.class);
    }

    private Class<?> getGenericType(Field field) {
        ParameterizedType type = (ParameterizedType) field.getGenericType();
        return (Class<?>) type.getActualTypeArguments()[0];
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractFirstMap(Object data) {
        if (data instanceof List<?> list && !list.isEmpty()) {
            return (Map<String, Object>) list.get(0);
        } else if (data instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        } else {
            throw new IllegalArgumentException("Invalid payload format for entity guessing.");
        }
    }
}

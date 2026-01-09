package com.genJson.payloadgen.service;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import com.genJson.payloadgen.model.Product;
import com.genJson.payloadgen.model.User;
import com.genJson.payloadgen.repository.ProductRepository;
import com.genJson.payloadgen.repository.UserRepository;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class EntityRegistry {

    private final Map<String, Class<?>> entityClasses = new HashMap<>();
    private final Map<String, JpaRepository<?, ?>> repositories = new HashMap<>();

    public EntityRegistry(UserRepository userRepo, ProductRepository productRepo) {
        // Register all entity → repository pairs
        registerEntity("user", User.class, userRepo);
        registerEntity("product", Product.class, productRepo);

        System.out.println("✅ Registered entities: " + entityClasses.keySet());
    }

    private void registerEntity(String name, Class<?> entityClass, JpaRepository<?, ?> repository) {
        entityClasses.put(name.toLowerCase(), entityClass);
        repositories.put(name.toLowerCase(), repository);
    }

    public Class<?> getEntityClass(String name) {
        if (name == null) return null;
        return entityClasses.get(name.toLowerCase());
    }

    public JpaRepository<?, ?> getRepository(String name) {
        if (name == null) return null;
        return repositories.get(name.toLowerCase());
    }

    /**
     * Try to infer entity type based on payload keys.
     * Returns null if no good match is found.
     */
    public Class<?> guessEntityByPayload(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return null;
        }

        Class<?> bestMatch = null;
        double bestScore = 0;

        for (Map.Entry<String, Class<?>> entry : entityClasses.entrySet()) {
            Class<?> clazz = entry.getValue();
            Set<String> entityFields = Arrays.stream(clazz.getDeclaredFields())
                    .map(Field::getName)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());

            long matchCount = payload.keySet().stream()
                    .map(String::toLowerCase)
                    .filter(entityFields::contains)
                    .count();

            double score = (double) matchCount / entityFields.size();

            // Require at least 2 field matches OR >50% similarity
            if ((matchCount >= 2 || score > 0.5) && score > bestScore) {
                bestScore = score;
                bestMatch = clazz;
            }
        }

        if (bestMatch == null) {
            System.err.println("⚠️  Unable to determine entity type from payload fields: " + payload.keySet());
        } else {
            System.out.println("🔍 Guessed entity: " + bestMatch.getSimpleName());
        }

        return bestMatch;
    }

    /**
     * Find the repository based on entity class.
     */
    public JpaRepository<?, ?> getRepositoryByEntity(Class<?> entityClass) {
        if (entityClass == null) return null;

        // First try by exact mapping
        for (Map.Entry<String, Class<?>> entry : entityClasses.entrySet()) {
            if (entry.getValue().equals(entityClass)) {
                return repositories.get(entry.getKey());
            }
        }

        // Fallback: try by name similarity
        return repositories.entrySet().stream()
                .filter(e -> e.getKey().contains(entityClass.getSimpleName().toLowerCase()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }

    public Set<String> getRegisteredEntities() {
        return entityClasses.keySet();
    }
}

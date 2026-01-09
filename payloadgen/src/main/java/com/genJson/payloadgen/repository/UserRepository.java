package com.genJson.payloadgen.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.genJson.payloadgen.model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    
}

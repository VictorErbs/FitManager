package com.academia.fitmanager.repository;

import com.academia.fitmanager.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    // Custom query to find active students
    List<Student> findByStatus(String status);
}

package com.academia.fitmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE, OVERDUE

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    // Helper constructor for seeding data
    public Student(String name, String email, String status, LocalDate enrollmentDate) {
        this.name = name;
        this.email = email;
        this.status = status;
        this.enrollmentDate = enrollmentDate;
    }
}

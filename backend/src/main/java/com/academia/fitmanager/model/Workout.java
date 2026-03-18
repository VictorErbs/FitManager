package com.academia.fitmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String division; // Ex: "Treino A", "Treino B", "Treino C"

    @Column
    private String objective; // Ex: "Hipertrofia", "Emagrecimento", "Resistência"

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "professor_name")
    private String professorName;

    @Column(length = 2000)
    private String exercises; // JSON string of exercises

    public Workout(String title, String division, String objective, String studentName, String professorName, String exercises) {
        this.title = title;
        this.division = division;
        this.objective = objective;
        this.studentName = studentName;
        this.professorName = professorName;
        this.exercises = exercises;
    }
}

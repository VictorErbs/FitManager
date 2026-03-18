package com.academia.fitmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "checkins")
@Data
@NoArgsConstructor
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    @Column
    private String note;

    public CheckIn(String studentName, String note) {
        this.studentName = studentName;
        this.checkInTime = LocalDateTime.now();
        this.note = note;
    }
}

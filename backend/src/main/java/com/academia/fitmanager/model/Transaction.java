package com.academia.fitmanager.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String type; // "INCOME" or "EXPENSE"

    @Column(nullable = false)
    private LocalDate date;

    @Column
    private String category; // Ex: "Mensalidade", "Salário", "Equipamentos"

    public Transaction(String description, Double amount, String type, LocalDate date, String category) {
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
    }
}

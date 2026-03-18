package com.academia.fitmanager.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

/**
 * DTO de SAÍDA com os dados de um Aluno retornados pela API.
 * Separa o modelo de banco do contrato da API, permitindo
 * controlar exatamente quais campos são expostos ao cliente.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String status;
    private String statusLabel; // Ex: "Ativo", "Inadimplente"
    private LocalDate enrollmentDate;
}

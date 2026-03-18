package com.academia.fitmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

/**
 * DTO de ENTRADA para criação e atualização de Alunos.
 * Recebe os dados do frontend e valida antes de persistir.
 */
@Data
public class StudentRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    private String name;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    private String status = "ACTIVE"; // Padrão: Ativo

    private LocalDate enrollmentDate;
}

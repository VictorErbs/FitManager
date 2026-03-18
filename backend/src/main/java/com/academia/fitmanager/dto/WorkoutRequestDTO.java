package com.academia.fitmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO de ENTRADA para criação de fichas de treino.
 * Recebe os dados do professor pelo frontend.
 */
@Data
public class WorkoutRequestDTO {

    @NotBlank(message = "Título é obrigatório")
    private String title;

    @NotBlank(message = "Divisão é obrigatória")
    private String division;

    private String objective;

    @NotBlank(message = "Nome do aluno é obrigatório")
    private String studentName;

    @NotBlank(message = "Nome do professor é obrigatório")
    private String professorName;

    private String exercises; // JSON string com lista de exercícios
}

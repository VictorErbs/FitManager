package com.academia.fitmanager.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO de SAÍDA com os dados de uma Ficha de Treino retornada pela API.
 * Inclui um campo calculado com a contagem de exercícios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutResponseDTO {

    private Long id;
    private String title;
    private String division;
    private String objective;
    private String studentName;
    private String professorName;
    private String exercises; // JSON string
    private int exerciseCount; // Campo calculado
}

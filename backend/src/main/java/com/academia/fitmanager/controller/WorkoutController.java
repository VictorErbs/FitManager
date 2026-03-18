package com.academia.fitmanager.controller;

import com.academia.fitmanager.dto.WorkoutRequestDTO;
import com.academia.fitmanager.dto.WorkoutResponseDTO;
import com.academia.fitmanager.model.Workout;
import com.academia.fitmanager.repository.WorkoutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutRepository workoutRepository;

    @PostConstruct
    public void initData() {
        if (workoutRepository.count() == 0) {
            String exA = "[{\"name\":\"Supino Reto\",\"sets\":4,\"reps\":\"10-12\",\"rest\":\"60s\"},{\"name\":\"Supino Inclinado Halteres\",\"sets\":3,\"reps\":\"12\",\"rest\":\"60s\"},{\"name\":\"Crucifixo\",\"sets\":3,\"reps\":\"15\",\"rest\":\"45s\"},{\"name\":\"Tríceps Pulley\",\"sets\":4,\"reps\":\"12\",\"rest\":\"45s\"}]";
            String exB = "[{\"name\":\"Puxada Frontal\",\"sets\":4,\"reps\":\"10\",\"rest\":\"60s\"},{\"name\":\"Remada Curvada\",\"sets\":4,\"reps\":\"10\",\"rest\":\"60s\"},{\"name\":\"Rosca Direta\",\"sets\":3,\"reps\":\"12\",\"rest\":\"45s\"},{\"name\":\"Rosca Martelo\",\"sets\":3,\"reps\":\"12\",\"rest\":\"45s\"}]";
            workoutRepository.save(new Workout("Treino A - Peito e Tríceps", "Treino A", "Hipertrofia", "João Alves", "Prof. Paulo", exA));
            workoutRepository.save(new Workout("Treino B - Costas e Bíceps", "Treino B", "Hipertrofia", "João Alves", "Prof. Paulo", exB));
            workoutRepository.save(new Workout("Treino A - Corpo Completo",  "Treino A", "Emagrecimento","Maria Costa","Prof. Paulo", exA));
            System.out.println("✅ Workouts seeded!");
        }
    }

    // Converts Entity -> ResponseDTO (with computed exerciseCount)
    private WorkoutResponseDTO toResponseDTO(Workout w) {
        int count = 0;
        if (w.getExercises() != null && !w.getExercises().isEmpty()) {
            // Count JSON array elements by counting '{'
            count = (int) w.getExercises().chars().filter(c -> c == '{').count();
        }
        return new WorkoutResponseDTO(
            w.getId(), w.getTitle(), w.getDivision(), w.getObjective(),
            w.getStudentName(), w.getProfessorName(), w.getExercises(), count
        );
    }

    // Converts RequestDTO -> Entity
    private Workout toEntity(WorkoutRequestDTO dto) {
        Workout w = new Workout();
        w.setTitle(dto.getTitle());
        w.setDivision(dto.getDivision());
        w.setObjective(dto.getObjective());
        w.setStudentName(dto.getStudentName());
        w.setProfessorName(dto.getProfessorName());
        w.setExercises(dto.getExercises());
        return w;
    }

    // GET /api/workouts
    @GetMapping
    public List<WorkoutResponseDTO> getAllWorkouts() {
        return workoutRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // POST /api/workouts
    @PostMapping
    public WorkoutResponseDTO createWorkout(@Valid @RequestBody WorkoutRequestDTO dto) {
        return toResponseDTO(workoutRepository.save(toEntity(dto)));
    }

    // DELETE /api/workouts/{id}
    @DeleteMapping("/{id}")
    public void deleteWorkout(@PathVariable Long id) {
        workoutRepository.deleteById(id);
    }
}

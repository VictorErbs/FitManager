package com.academia.fitmanager.controller;

import com.academia.fitmanager.dto.StudentRequestDTO;
import com.academia.fitmanager.dto.StudentResponseDTO;
import com.academia.fitmanager.model.Student;
import com.academia.fitmanager.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    // Status labels in Portuguese
    private static final Map<String, String> STATUS_LABELS = Map.of(
        "ACTIVE", "Ativo",
        "INACTIVE", "Inativo",
        "OVERDUE", "Inadimplente"
    );

    // Seed initial data
    @PostConstruct
    public void initData() {
        if (studentRepository.count() == 0) {
            studentRepository.save(new Student("João Alves",  "joao@email.com",  "ACTIVE",  LocalDate.now().minusMonths(2)));
            studentRepository.save(new Student("Maria Costa", "maria@email.com", "ACTIVE",  LocalDate.now().minusMonths(1)));
            studentRepository.save(new Student("Carlos Silva","carlos@email.com","OVERDUE", LocalDate.now().minusMonths(6)));
            studentRepository.save(new Student("Ana Silva",   "ana@email.com",   "ACTIVE",  LocalDate.now()));
            System.out.println("✅ Students seeded!");
        }
    }

    // Converts Entity -> ResponseDTO
    private StudentResponseDTO toResponseDTO(Student s) {
        String label = STATUS_LABELS.getOrDefault(s.getStatus(), s.getStatus());
        return new StudentResponseDTO(s.getId(), s.getName(), s.getEmail(), s.getStatus(), label, s.getEnrollmentDate());
    }

    // Converts RequestDTO -> Entity
    private Student toEntity(StudentRequestDTO dto) {
        Student s = new Student();
        s.setName(dto.getName());
        s.setEmail(dto.getEmail());
        s.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");
        s.setEnrollmentDate(dto.getEnrollmentDate() != null ? dto.getEnrollmentDate() : LocalDate.now());
        return s;
    }

    // GET /api/students
    @GetMapping
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // POST /api/students
    @PostMapping
    public StudentResponseDTO createStudent(@Valid @RequestBody StudentRequestDTO dto) {
        Student saved = studentRepository.save(toEntity(dto));
        return toResponseDTO(saved);
    }

    // DELETE /api/students/{id}
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
    }
}

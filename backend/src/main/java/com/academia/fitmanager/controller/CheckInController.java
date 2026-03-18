package com.academia.fitmanager.controller;

import com.academia.fitmanager.model.CheckIn;
import com.academia.fitmanager.repository.CheckInRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkins")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CheckInController {

    private final CheckInRepository checkInRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @PostConstruct
    public void initData() {
        if (checkInRepository.count() == 0) {
            checkInRepository.save(new CheckIn("João Alves", null));
            checkInRepository.save(new CheckIn("Maria Costa", null));
            checkInRepository.save(new CheckIn("Ana Silva", "Aula de spinning"));
            System.out.println("✅ CheckIns seeded!");
        }
    }

    // GET /api/checkins - todos, mais recentes primeiro
    @GetMapping
    public List<Map<String, Object>> getAllCheckIns() {
        return checkInRepository.findAllByOrderByCheckInTimeDesc()
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    // GET /api/checkins/today - check-ins de hoje
    @GetMapping("/today")
    public List<Map<String, Object>> getTodayCheckIns() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);
        return checkInRepository
                .findByCheckInTimeBetweenOrderByCheckInTimeDesc(startOfDay, endOfDay)
                .stream().map(this::toMap).collect(Collectors.toList());
    }

    // GET /api/checkins/today/count
    @GetMapping("/today/count")
    public Map<String, Long> getTodayCount() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay   = startOfDay.plusDays(1);
        long count = checkInRepository
                .findByCheckInTimeBetweenOrderByCheckInTimeDesc(startOfDay, endOfDay).size();
        return Map.of("count", count);
    }

    // POST /api/checkins
    @PostMapping
    public Map<String, Object> createCheckIn(@RequestBody Map<String, String> body) {
        CheckIn saved = checkInRepository.save(
            new CheckIn(body.get("studentName"), body.get("note"))
        );
        return toMap(saved);
    }

    private Map<String, Object> toMap(CheckIn c) {
        return Map.of(
            "id",            c.getId(),
            "studentName",   c.getStudentName(),
            "checkInTime",   c.getCheckInTime().toString(),
            "timeFormatted", c.getCheckInTime().format(FMT),
            "note",          c.getNote() != null ? c.getNote() : ""
        );
    }
}

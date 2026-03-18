package com.academia.fitmanager.repository;

import com.academia.fitmanager.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByCheckInTimeBetweenOrderByCheckInTimeDesc(LocalDateTime start, LocalDateTime end);
    List<CheckIn> findAllByOrderByCheckInTimeDesc();
}

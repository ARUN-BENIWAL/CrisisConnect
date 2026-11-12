package com.crisisconnect.repository;

import com.crisisconnect.entity.ResolutionReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResolutionReportRepository extends JpaRepository<ResolutionReport, Long> {
    List<ResolutionReport> findByCrisisId(Long crisisId);
    Optional<ResolutionReport> findByAssignmentId(Long assignmentId);
}

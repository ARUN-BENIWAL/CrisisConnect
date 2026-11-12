package com.crisisconnect.repository;

import com.crisisconnect.entity.ProgressNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProgressNoteRepository extends JpaRepository<ProgressNote, Long> {
    List<ProgressNote> findByAssignmentIdOrderByCreatedAtDesc(Long assignmentId);
    List<ProgressNote> findByCrisisIdOrderByCreatedAtDesc(Long crisisId);
}

package com.crisisconnect.repository;

import com.crisisconnect.entity.Assignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCrisisIdAndIsActive(Long crisisId, Boolean isActive);
    List<Assignment> findByCrisisId(Long crisisId);
    List<Assignment> findByResponderIdAndIsActive(Long responderId, Boolean isActive);
    Page<Assignment> findByResponderId(Long responderId, Pageable pageable);
    Page<Assignment> findByResponderIdAndIsActive(Long responderId, Boolean isActive, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.responder.id = :responderId AND a.isActive = true AND a.status NOT IN ('RESOLVED', 'CANCELLED')")
    long countActiveByResponder(@Param("responderId") Long responderId);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.responder.id = :responderId AND a.status = :status")
    long countByResponderAndStatus(@Param("responderId") Long responderId, @Param("status") Assignment.Status status);

    boolean existsByCrisisIdAndResponderIdAndIsActive(Long crisisId, Long responderId, Boolean isActive);

    @Query("SELECT a FROM Assignment a WHERE a.responder.id = :responderId AND a.isActive = true ORDER BY a.assignedAt DESC")
    List<Assignment> findActiveByResponder(@Param("responderId") Long responderId);

    @Query("SELECT a FROM Assignment a WHERE a.crisis.id = :crisisId AND a.isActive = true")
    List<Assignment> findActiveByCrisisId(@Param("crisisId") Long crisisId);

    @Query("SELECT a.responder.id, COUNT(a) FROM Assignment a WHERE a.isActive = true AND a.status NOT IN ('RESOLVED', 'CANCELLED') GROUP BY a.responder.id")
    List<Object[]> countActiveAssignmentsPerResponder();
}

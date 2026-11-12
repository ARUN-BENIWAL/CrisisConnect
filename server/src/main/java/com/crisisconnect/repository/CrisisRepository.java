package com.crisisconnect.repository;

import com.crisisconnect.entity.Crisis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CrisisRepository extends JpaRepository<Crisis, Long> {
    Optional<Crisis> findByPublicId(String publicId);

    @Query("SELECT c FROM Crisis c WHERE c.status = :status")
    List<Crisis> findByStatus(@Param("status") Crisis.Status status);

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.status = :status")
    long countByStatus(@Param("status") Crisis.Status status);

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.severity = :severity")
    long countBySeverity(@Param("severity") Crisis.Severity severity);

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.status NOT IN ('CLOSED', 'INVALID', 'DUPLICATE')")
    long countActive();

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.status = 'SUBMITTED'")
    long countUnreviewed();

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.severity = 'CRITICAL' AND c.status NOT IN ('RESOLVED', 'CLOSED', 'INVALID')")
    long countActiveCritical();

    @Query("SELECT c FROM Crisis c WHERE " +
           "(:search IS NULL OR c.title LIKE %:search% OR c.publicId LIKE %:search%) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:severity IS NULL OR c.severity = :severity) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId)")
    Page<Crisis> searchCrises(
        @Param("search") String search,
        @Param("status") Crisis.Status status,
        @Param("severity") Crisis.Severity severity,
        @Param("categoryId") Long categoryId,
        Pageable pageable
    );

    @Query("SELECT c.category.name, COUNT(c) FROM Crisis c GROUP BY c.category.name")
    List<Object[]> countByCategory();

    @Query("SELECT c.severity, COUNT(c) FROM Crisis c GROUP BY c.severity")
    List<Object[]> countGroupedBySeverity();

    @Query("SELECT c.status, COUNT(c) FROM Crisis c GROUP BY c.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT DATE(c.createdAt), COUNT(c) FROM Crisis c WHERE c.createdAt >= :since GROUP BY DATE(c.createdAt) ORDER BY DATE(c.createdAt)")
    List<Object[]> countByDay(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(c) FROM Crisis c WHERE c.createdAt >= :since")
    long countSince(@Param("since") LocalDateTime since);
}

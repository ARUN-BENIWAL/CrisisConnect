package com.crisisconnect.repository;

import com.crisisconnect.entity.CrisisStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CrisisStatusHistoryRepository extends JpaRepository<CrisisStatusHistory, Long> {
    List<CrisisStatusHistory> findByCrisisIdOrderByCreatedAtDesc(Long crisisId);
}

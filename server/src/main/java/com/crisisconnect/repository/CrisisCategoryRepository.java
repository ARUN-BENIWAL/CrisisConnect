package com.crisisconnect.repository;

import com.crisisconnect.entity.CrisisCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CrisisCategoryRepository extends JpaRepository<CrisisCategory, Long> {
    Optional<CrisisCategory> findByName(String name);
    List<CrisisCategory> findByIsActive(Boolean isActive);
}

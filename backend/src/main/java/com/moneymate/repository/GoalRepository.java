package com.moneymate.repository;

import com.moneymate.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndStatus(Long userId, String status);

    @Query("SELECT COALESCE(SUM(g.targetAmount), 0) FROM Goal g WHERE g.user.id = :userId")
    BigDecimal sumTargetAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(g.savedAmount), 0) FROM Goal g WHERE g.user.id = :userId")
    BigDecimal sumSavedAmountByUserId(@Param("userId") Long userId);
}

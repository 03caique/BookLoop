package com.bookloop.api.match;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    boolean existsByUserAIdAndUserBId(
            Long userAId,
            Long userBId
    );

    @Query("""
        SELECT m
        FROM Match m
        WHERE m.userA.id = :userId
           OR m.userB.id = :userId
    """)
    List<Match> findMatchesByUser(@Param("userId") Long userId);

}

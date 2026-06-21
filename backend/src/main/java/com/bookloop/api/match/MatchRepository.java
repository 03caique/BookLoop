package com.bookloop.api.match;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchRepository extends JpaRepository<Match, Long> {

    boolean existsByUserAIdAndUserBId(
            Long userAId,
            Long userBId
    );

}

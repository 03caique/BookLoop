package com.bookloop.api.transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByMatchId(Long matchId);

    Page<Transaction> findByProponentIdOrRequesterId(
            Long proponentId,
            Long requesterId,
            Pageable pageable
    );

    Optional<Transaction> findByMatchIdAndProponentId(Long matchId, Long proponentId);
}

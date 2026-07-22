package com.bookloop.api.bookrequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    boolean existsByBookIdAndRequesterId(
        Long bookId,
        Long requesterId
    );

    List<BookRequest> findByBookUserIdAndStatus(
            Long proponentId,
            BookRequestStatus status
    );

    List<BookRequest> findByRequesterIdAndBookUserIdAndStatus(
            Long requesterId,
            Long bookOwnerId,
            BookRequestStatus status
    );

    Page<BookRequest> findByRequesterId(
            Long requesterId,
            Pageable pageable
    );

    boolean existsByBookIdAndRequesterIdAndStatusIn(
            Long bookId,
            Long requesterId,
            List<BookRequestStatus> status
    );

}

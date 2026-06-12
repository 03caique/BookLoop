package com.bookloop.api.bookrequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    boolean existsByBookIdAndRequesterId(
        Long bookId,
        Long requesterId
    );

    Page<BookRequest> findByBookUserIdAndStatus(
            Long proponentId,
            BookRequestStatus status,
            Pageable pageable
    );

}

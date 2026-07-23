package com.bookloop.api.book;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    Page<Book> findByStatusInAndTitleContainingIgnoreCaseOrStatusInAndAuthorContainingIgnoreCase(
            List<BookStatus> status,
            String title,
            List<BookStatus> status2,
            String author,
            Pageable pageable
    );

    List<Book> findByUserIdAndStatusNot(Long userId, BookStatus status);

}

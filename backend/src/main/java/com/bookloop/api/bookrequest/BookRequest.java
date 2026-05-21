package com.bookloop.api.bookrequest;

import com.bookloop.api.book.Book;
import com.bookloop.api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "book_requests")
public class BookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull
    private BookRequestStatus status;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @NotNull
    private Book book;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    @NotNull
    private User requester;

}

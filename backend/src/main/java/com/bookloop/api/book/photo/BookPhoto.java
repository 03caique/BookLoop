package com.bookloop.api.book.photo;

import com.bookloop.api.book.Book;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BookPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

}

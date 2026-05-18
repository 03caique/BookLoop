package com.bookloop.api.book.dto;

import com.bookloop.api.book.BookStatus;
import lombok.Data;

@Data
public class BookResponseDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private BookStatus status;
    private Long userId;
}

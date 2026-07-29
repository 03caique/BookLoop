package com.bookloop.api.book.dto;

import com.bookloop.api.book.BookCondition;
import com.bookloop.api.book.BookStatus;
import lombok.Data;
import java.util.List;

@Data
public class BookResponseDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private BookCondition condition;
    private BookStatus status;
    private Long userId;
    private String userName;
    private List<BookPhotoResponseDTO> photos;
}
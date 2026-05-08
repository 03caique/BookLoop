package com.bookloop.api.book.dto;

import com.bookloop.api.book.BookStatus;
import lombok.Data;

@Data
public class BookResponseDTO {
    private Long id;
    private String titulo;
    private String autor;
    private String isbn;
    private String descricao;
    private BookStatus status;
    private Long userId;
}

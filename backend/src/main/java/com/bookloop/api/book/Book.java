package com.bookloop.api.book;

import com.bookloop.api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String titulo;

    @NotBlank
    private String autor;

    private String isbn;

    @NotBlank
    private String descricao;

    @Enumerated(EnumType.STRING)
    @NotNull
    private BookStatus status;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}

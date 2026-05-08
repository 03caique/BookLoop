package com.bookloop.api.book;

import com.bookloop.api.book.dto.BookRequestDTO;
import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor

public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public BookResponseDTO create(BookRequestDTO dto){

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        Book book = new Book();

        book.setTitulo(dto.getTitulo());
        book.setAutor(dto.getAutor());
        book.setIsbn(dto.getIsbn());
        book.setDescricao(dto.getDescricao());
        book.setStatus(dto.getStatus());

        book.setUser(user);
        Book savedBook = bookRepository.save(book);
        BookResponseDTO responseDTO = modelMapper.map(savedBook, BookResponseDTO.class);
        responseDTO.setUserId(user.getId());

        return responseDTO;
    }
}

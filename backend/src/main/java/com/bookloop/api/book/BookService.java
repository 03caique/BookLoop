package com.bookloop.api.book;

import com.bookloop.api.book.dto.BookRequestDTO;
import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

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

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setDescription(dto.getDescription());
        book.setStatus(dto.getStatus());

        book.setUser(user);
        Book savedBook = bookRepository.save(book);
        BookResponseDTO responseDTO = modelMapper.map(savedBook, BookResponseDTO.class);
        responseDTO.setUserId(user.getId());

        return responseDTO;
    }

    public Page<BookResponseDTO> findByFilter(String search, Pageable pageable) {

        List<BookStatus> status = List.of(BookStatus.DOACAO, BookStatus.TROCA);

        Page<Book> books = bookRepository.findByStatusInAndTitleContainingIgnoreCaseOrStatusInAndAuthorContainingIgnoreCase(
                status,
                search,
                status,
                search,
                pageable
        );

        return books.map(book -> {BookResponseDTO dto = modelMapper.map(
                    book,
                    BookResponseDTO.class
            );

            dto.setUserId(book.getUser().getId());
            dto.setUserName(book.getUser().getName());

            return dto;
        });
    }

    public BookResponseDTO findById(Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));

        BookResponseDTO dto = modelMapper.map(book, BookResponseDTO.class);

        dto.setUserId(book.getUser().getId());
        dto.setUserName(book.getUser().getName());

        return dto;
    }
}

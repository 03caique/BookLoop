package com.bookloop.api.book;

import com.bookloop.api.book.dto.BookRequestDTO;
import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.book.photo.BookPhoto;
import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor

public class BookService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final LoggedUserService loggedUserService;

    public BookResponseDTO create(BookRequestDTO dto){
        User loggedUser = loggedUserService.getLoggedUser();

        if (dto.getPhotos() == null || dto.getPhotos().size() < 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O livro deve possuir pelo menos 3 fotos.");
        }

        Book book = new Book();

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setIsbn(dto.getIsbn());
        book.setDescription(dto.getDescription());
        book.setStatus(dto.getStatus());
        book.setCondition(dto.getCondition());
        book.setUser(loggedUser);

        List<BookPhoto> photos = dto.getPhotos()
                .stream()
                .map(url -> {
                    BookPhoto photo = new BookPhoto();
                    photo.setImageUrl(url);
                    photo.setBook(book);
                    return photo;
                })
                .collect(Collectors.toList());

        book.setPhotos(photos);

        Book savedBook = bookRepository.save(book);
        BookResponseDTO responseDTO = modelMapper.map(savedBook, BookResponseDTO.class);
        responseDTO.setUserId(loggedUser.getId());
        responseDTO.setUserName(loggedUser.getName());

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

    public List<BookResponseDTO> findByUserId(Long id){
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        List<Book> books = bookRepository.findByUserIdAndStatusNot(id, BookStatus.INATIVO);

        return books.stream()
                .map(book -> modelMapper.map(book, BookResponseDTO.class))
                .collect(Collectors.toList());
    }

    public BookResponseDTO update(Long bookId, BookRequestDTO requestDTO){
        User loggedUser = loggedUserService.getLoggedUser();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));

        if (!book.getUser().getId().equals(loggedUser.getId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O usuário não possui permissão para editar este livro");
        }

        book.setTitle(requestDTO.getTitle());
        book.setAuthor(requestDTO.getAuthor());
        book.setIsbn(requestDTO.getIsbn());
        book.setDescription(requestDTO.getDescription());
        book.setStatus(requestDTO.getStatus());
        book.setCondition(requestDTO.getCondition());

        Book updatedBook = bookRepository.save(book);

        BookResponseDTO responseDTO = modelMapper.map(updatedBook, BookResponseDTO.class);

        responseDTO.setUserId(updatedBook.getUser().getId());
        responseDTO.setUserName(updatedBook.getUser().getName());

        return responseDTO;
    }

    public void delete(Long bookId) {
        User loggedUser = loggedUserService.getLoggedUser();

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));

        if (!book.getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O usuário não possui permissão para remover este livro");
        }

        book.setStatus(BookStatus.INATIVO);

        bookRepository.save(book);
    }
}

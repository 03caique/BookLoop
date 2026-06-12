package com.bookloop.api.bookrequest;

import com.bookloop.api.book.Book;
import com.bookloop.api.book.BookRepository;
import com.bookloop.api.bookrequest.dto.BookRequestRequestDTO;
import com.bookloop.api.bookrequest.dto.BookRequestResponseDTO;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class BookRequestService {

    private final BookRequestRepository bookRequestRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public BookRequestResponseDTO create(BookRequestRequestDTO dto) {

        Book book = bookRepository.findById(dto.getBookId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));


        User requester = userRepository.findById(dto.getRequesterId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (book.getUser().getId().equals(dto.getRequesterId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode solicitar seu próprio livro");
        }

        if (bookRequestRepository.existsByBookIdAndRequesterId(dto.getBookId(), dto.getRequesterId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solicitação já enviada");
        }

        BookRequest request = new BookRequest();

        request.setBook(book);
        request.setRequester(requester);
        request.setStatus(BookRequestStatus.PENDENTE);

        BookRequest savedRequest = bookRequestRepository.save(request);

        BookRequestResponseDTO responseDTO = modelMapper.map(savedRequest, BookRequestResponseDTO.class);
        responseDTO.setBookId(book.getId());
        responseDTO.setRequesterId(requester.getId());

        return responseDTO;
    }

    public Page<BookRequestResponseDTO> findByProponent(Long proponentId, Pageable pageable) {
        Page<BookRequest> bookRequests = bookRequestRepository.findByBookUserIdAndStatus(
                proponentId,
                BookRequestStatus.PENDENTE,
                pageable);

        return bookRequests.map(bookRequest -> {
            BookRequestResponseDTO dto = modelMapper.map(
                    bookRequest,
                    BookRequestResponseDTO.class
            );

            dto.setBookId(bookRequest.getBook().getId());

            dto.setBookTitle(bookRequest.getBook().getTitle());

            dto.setRequesterId(bookRequest.getRequester().getId());

            dto.setRequesterName(bookRequest.getRequester().getName());

            return dto;
        });

    }

}

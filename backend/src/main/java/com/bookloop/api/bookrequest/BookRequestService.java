package com.bookloop.api.bookrequest;

import com.bookloop.api.book.Book;
import com.bookloop.api.book.BookRepository;
import com.bookloop.api.bookrequest.dto.BookRequestRequestDTO;
import com.bookloop.api.bookrequest.dto.BookRequestResponseDTO;
import com.bookloop.api.bookrequest.dto.BookRequestUpdateDTO;
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

import java.util.Optional;

@Service
@AllArgsConstructor
public class BookRequestService {

    private final BookRequestRepository bookRequestRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public BookRequestResponseDTO create(BookRequestRequestDTO dto) {

        Book book = bookRepository.findById(dto.getBookId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));


        User requester = userRepository.findById(dto.getRequesterId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

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
        Page<BookRequest> bookRequests = bookRequestRepository.findByBookUserIdAndStatus(proponentId, BookRequestStatus.PENDENTE, pageable);

        return bookRequests.map(bookRequest -> {
            BookRequestResponseDTO dto = modelMapper.map(bookRequest, BookRequestResponseDTO.class);

            dto.setBookId(bookRequest.getBook().getId());

            dto.setBookTitle(bookRequest.getBook().getTitle());

            dto.setRequesterId(bookRequest.getRequester().getId());

            dto.setRequesterName(bookRequest.getRequester().getName());

            return dto;
        });

    }

    public BookRequestResponseDTO updateStatus(Long bookRequestId, BookRequestUpdateDTO updateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User loggedUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        BookRequest bookRequest = bookRequestRepository.findById(bookRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        if (!bookRequest.getBook().getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não possui permissão para alterar esta solicitação");
        }

        bookRequest.setStatus(updateDTO.getStatus());

        BookRequest updatedRequest = bookRequestRepository.save(bookRequest);

        BookRequestResponseDTO responseDTO = modelMapper.map(updatedRequest, BookRequestResponseDTO.class);

        responseDTO.setBookId(updatedRequest.getBook().getId());
        responseDTO.setBookTitle(updatedRequest.getBook().getTitle());
        responseDTO.setRequesterId(updatedRequest.getRequester().getId());
        responseDTO.setRequesterName(updatedRequest.getRequester().getName());

        return responseDTO;
    }
}

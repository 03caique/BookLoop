package com.bookloop.api.bookrequest;

import com.bookloop.api.book.Book;
import com.bookloop.api.book.BookRepository;
import com.bookloop.api.book.BookStatus;
import com.bookloop.api.bookrequest.dto.BookRequestRequestDTO;
import com.bookloop.api.bookrequest.dto.BookRequestResponseDTO;
import com.bookloop.api.bookrequest.dto.BookRequestUpdateDTO;
import com.bookloop.api.match.MatchService;
import com.bookloop.api.notification.NotificationService;
import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.socioeconomicprofile.SocioeconomicProfile;
import com.bookloop.api.socioeconomicprofile.SocioeconomicProfileRepository;
import com.bookloop.api.transaction.TransactionService;
import com.bookloop.api.user.User;
import com.bookloop.api.user.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;


@Service
@AllArgsConstructor
public class BookRequestService {

    private final BookRequestRepository bookRequestRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final MatchService matchService;
    private final LoggedUserService loggedUserService;
    private final NotificationService notificationService;
    private final SocioeconomicProfileRepository socioeconomicProfileRepository;
    private final TransactionService transactionService;

    public BookRequestResponseDTO create(BookRequestRequestDTO dto) {

        Book book = bookRepository.findById(dto.getBookId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado"));

        User requester = userRepository.findById(dto.getRequesterId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (book.getUser().getId().equals(dto.getRequesterId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode solicitar seu próprio livro");
        }

        if (bookRequestRepository.existsByBookIdAndRequesterIdAndStatusIn(
                dto.getBookId(),
                dto.getRequesterId(),
                List.of(
                        BookRequestStatus.PENDENTE,
                        BookRequestStatus.ACEITA,
                        BookRequestStatus.RECUSADA
                )
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solicitação já enviada"
            );
        }

        BookRequest request = new BookRequest();

        request.setBook(book);
        request.setRequester(requester);
        request.setStatus(BookRequestStatus.PENDENTE);

        BookRequest savedRequest = bookRequestRepository.save(request);
        notificationService.createRequestNotification(savedRequest);

        BookRequestResponseDTO responseDTO = modelMapper.map(savedRequest, BookRequestResponseDTO.class);
        responseDTO.setBookId(book.getId());
        responseDTO.setRequesterId(requester.getId());

        return responseDTO;
    }

    public Page<BookRequestResponseDTO> findByProponent(Long proponentId, Pageable pageable) {
        List<BookRequest> bookRequests = bookRequestRepository.findByBookUserIdAndStatus(proponentId, BookRequestStatus.PENDENTE);

        List<PrioritizedBookRequest> prioritizedRequests = bookRequests.stream().map(bookRequest -> {
            Integer priority = socioeconomicProfileRepository
                    .findByUserId(bookRequest.getRequester().getId())
                    .map(SocioeconomicProfile::calculatePriority)
                    .orElse(null);

            return new PrioritizedBookRequest(bookRequest, priority);
        }).sorted(Comparator.comparing(PrioritizedBookRequest::priority, Comparator.nullsLast(Comparator.reverseOrder()))).toList();

        int start = (int) pageable.getOffset();

        if (start >= prioritizedRequests.size()) {
            return new PageImpl<>(List.of(), pageable, prioritizedRequests.size());
        }

        int end = Math.min(start + pageable.getPageSize(), prioritizedRequests.size());

        List<BookRequestResponseDTO> content = prioritizedRequests.subList(start, end).stream().map(item -> {

            BookRequest bookRequest = item.bookRequest();

            BookRequestResponseDTO dto = modelMapper.map(bookRequest, BookRequestResponseDTO.class);

            dto.setBookId(bookRequest.getBook().getId());
            dto.setBookTitle(bookRequest.getBook().getTitle());
            dto.setRequesterId(bookRequest.getRequester().getId());
            dto.setRequesterName(bookRequest.getRequester().getName());

            socioeconomicProfileRepository
                    .findByUserId(bookRequest.getRequester().getId())
                    .ifPresentOrElse(
                            profile -> {
                                dto.setHasSocioeconomicProfile(true);
                                dto.setPriorityLevel(profile.calculatePriorityLevel());
                            },
                            () -> {
                                dto.setHasSocioeconomicProfile(false);
                                dto.setPriorityLevel(null);
                            }
                    );

            return dto;
        }).toList();

        return new PageImpl<>(content, pageable, prioritizedRequests.size());
    }

    public BookRequestResponseDTO updateStatus(Long bookRequestId, BookRequestUpdateDTO updateDTO) {
        User loggedUser = loggedUserService.getLoggedUser();

        BookRequest bookRequest = bookRequestRepository.findById(bookRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        if (!bookRequest.getBook().getUser().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não possui permissão para alterar esta solicitação");
        }

        if (updateDTO.getStatus() != BookRequestStatus.ACEITA && updateDTO.getStatus() != BookRequestStatus.RECUSADA){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não possui permissão para alterar a solicitação para esse status");
        }

        bookRequest.setStatus(updateDTO.getStatus());

        BookRequest updatedRequest = bookRequestRepository.save(bookRequest);

        if (updatedRequest.getStatus() == BookRequestStatus.ACEITA) {
            notificationService.createRequestAcceptedNotification(updatedRequest);

            if (updatedRequest.getBook().getStatus() == BookStatus.TROCA) {
                matchService.checkForMatch(updatedRequest);
            } else {
                transactionService.createDonationTransaction(updatedRequest);
            }
        }

        BookRequestResponseDTO responseDTO = modelMapper.map(updatedRequest, BookRequestResponseDTO.class);

        responseDTO.setBookId(updatedRequest.getBook().getId());
        responseDTO.setBookTitle(updatedRequest.getBook().getTitle());
        responseDTO.setRequesterId(updatedRequest.getRequester().getId());
        responseDTO.setRequesterName(updatedRequest.getRequester().getName());

        return responseDTO;
    }

    public void cancel(Long bookRequestId){
        User loggedUser = loggedUserService.getLoggedUser();

        BookRequest bookRequest = bookRequestRepository.findById(bookRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada"));

        if (!loggedUser.getId().equals(bookRequest.getRequester().getId())){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não possui permissão para cancelar esta solicitação");
        }

        if (bookRequest.getStatus() != BookRequestStatus.PENDENTE){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Somente solicitações pendentes podem ser canceladas");
        }

        bookRequest.setStatus(BookRequestStatus.CANCELADA);
        bookRequestRepository.save(bookRequest);
    }

    public Page<BookRequestResponseDTO> findByRequester(Pageable pageable){
        User loggedUser = loggedUserService.getLoggedUser();

        Page<BookRequest> bookRequests = bookRequestRepository.findByRequesterId(loggedUser.getId(), pageable);

        return bookRequests.map(bookRequest -> {
            BookRequestResponseDTO dto = modelMapper.map(bookRequest, BookRequestResponseDTO.class);

            dto.setBookId(bookRequest.getBook().getId());
            dto.setBookTitle(bookRequest.getBook().getTitle());
            dto.setRequesterId(bookRequest.getRequester().getId());
            dto.setRequesterName(bookRequest.getRequester().getName());
            return dto;
        });

    }

    private record PrioritizedBookRequest(BookRequest bookRequest, Integer priority){}

}

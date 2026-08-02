package com.bookloop.api.match;

import com.bookloop.api.book.BookStatus;
import com.bookloop.api.bookrequest.BookRequest;
import com.bookloop.api.bookrequest.BookRequestRepository;
import com.bookloop.api.bookrequest.BookRequestStatus;
import com.bookloop.api.notification.NotificationService;
import com.bookloop.api.transaction.Transaction;
import com.bookloop.api.transaction.TransactionRepository;
import com.bookloop.api.transaction.TransactionStatus;
import com.bookloop.api.user.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final BookRequestRepository bookRequestRepository;
    private final NotificationService notificationService;
    private final TransactionRepository transactionRepository;

    public void checkForMatch(BookRequest acceptedRequest) {

        Long requesterId = acceptedRequest.getRequester().getId();
        Long ownerId = acceptedRequest.getBook().getUser().getId();

        List<BookRequest> reverseRequests =
                bookRequestRepository.findByRequesterIdAndBookUserIdAndStatus(
                        ownerId,
                        requesterId,
                        BookRequestStatus.ACEITA
                );

        if (reverseRequests.isEmpty()) {
            return;
        }

        BookRequest requestFromUserA;
        BookRequest requestFromUserB;
        User userA;
        User userB;

        BookRequest reverseRequest = reverseRequests.get(0);

        if (reverseRequest.getBook().getStatus() != BookStatus.TROCA) {
            return;
        }

        if (requesterId < ownerId) {
            userA = acceptedRequest.getRequester();
            userB = acceptedRequest.getBook().getUser();

            requestFromUserA = acceptedRequest;
            requestFromUserB = reverseRequest;

        } else {
            userA = acceptedRequest.getBook().getUser();
            userB = acceptedRequest.getRequester();

            requestFromUserA = reverseRequest;
            requestFromUserB = acceptedRequest;
        }

        Long userAId = Math.min(requesterId, ownerId);
        Long userBId = Math.max(requesterId, ownerId);

        if (matchRepository.existsByUserAIdAndUserBId(userAId, userBId)) {
            return;
        }

        Match match = new Match();

        match.setUserA(userA);
        match.setUserB(userB);

        match.setRequestFromUserA(requestFromUserA);
        match.setRequestFromUserB(requestFromUserB);

        match.setStatus(MatchStatus.ATIVO);

        Match savedMatch = matchRepository.save(match);

        Transaction transactionA = new Transaction();
        transactionA.setMatch(savedMatch);
        transactionA.setBook(requestFromUserA.getBook());
        transactionA.setProponent(userA);
        transactionA.setRequester(userB);
        transactionA.setStatus(TransactionStatus.PENDENTE);

        Transaction transactionB = new Transaction();
        transactionB.setMatch(savedMatch);
        transactionB.setBook(requestFromUserB.getBook());
        transactionB.setProponent(userB);
        transactionB.setRequester(userA);
        transactionB.setStatus(TransactionStatus.PENDENTE);

        transactionRepository.save(transactionA);
        transactionRepository.save(transactionB);

        notificationService.createMatchNotification(savedMatch);
    }

    public List<MatchResponseDTO> findMatchesByUser(Long userId) {

        List<Match> matches = matchRepository.findMatchesByUser(userId);

        return matches.stream()
                .map(match -> toResponse(match, userId))
                .toList();
    }

    private MatchResponseDTO toResponse(Match match, Long userId) {
        MatchResponseDTO dto = new MatchResponseDTO();
        dto.setMatchId(match.getId());

        Transaction myTransaction = transactionRepository
                .findByMatchIdAndProponentId(match.getId(), userId)
                .orElseThrow();

        dto.setMyTransactionId(myTransaction.getId());
        dto.setMyTransactionStatus(myTransaction.getStatus());

        if (match.getUserA().getId().equals(userId)) {

            dto.setOtherUserId(match.getUserB().getId());
            dto.setOtherUserName(match.getUserB().getName());

            dto.setMyBookId(match.getRequestFromUserA().getBook().getId());
            dto.setMyBookTitle(match.getRequestFromUserA().getBook().getTitle());

            dto.setOtherBookId(match.getRequestFromUserB().getBook().getId());
            dto.setOtherBookTitle(match.getRequestFromUserB().getBook().getTitle());

        } else {

            dto.setOtherUserId(match.getUserA().getId());
            dto.setOtherUserName(match.getUserA().getName());

            dto.setMyBookId(match.getRequestFromUserB().getBook().getId());
            dto.setMyBookTitle(match.getRequestFromUserB().getBook().getTitle());

            dto.setOtherBookId(match.getRequestFromUserA().getBook().getId());
            dto.setOtherBookTitle(match.getRequestFromUserA().getBook().getTitle());
        }

        return dto;
    }
}
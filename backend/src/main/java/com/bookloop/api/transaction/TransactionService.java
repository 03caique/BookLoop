package com.bookloop.api.transaction;

import com.bookloop.api.book.BookStatus;
import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.match.Match;
import com.bookloop.api.match.MatchRepository;
import com.bookloop.api.match.MatchStatus;
import com.bookloop.api.notification.NotificationService;
import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.user.User;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final LoggedUserService loggedUserService;
    private final MatchRepository matchRepository;
    private final ModelMapper modelMapper;
    private final NotificationService notificationService;

    public void confirmDelivery(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada."));

        User loggedUser = loggedUserService.getLoggedUser();

        if (!transaction.getProponent().getId().equals(loggedUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente o proponente pode confirmar a entrega.");
        }

        if (transaction.getStatus() == TransactionStatus.FINALIZADA) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A entrega desta transação já foi confirmada.");
        }

        transaction.getBook().setStatus(BookStatus.ENTREGUE);

        transaction.setStatus(TransactionStatus.FINALIZADA);

        transactionRepository.save(transaction);

        notificationService.createTransactionFinishedNotification(transaction);

        List<Transaction> transactions = transactionRepository.findByMatchId(transaction.getMatch().getId());

        boolean allCompleted = transactions.stream()
                .allMatch(t -> t.getStatus() == TransactionStatus.FINALIZADA);

        if (allCompleted) {

            Match match = transaction.getMatch();

            match.setStatus(MatchStatus.CONCLUIDO);

            matchRepository.save(match);
        }
    }

    public Page<TransactionResponseDTO> findByUser(Long userId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByProponentIdOrRequesterId(userId, userId, pageable);

        return transactions.map(transaction -> {
            TransactionResponseDTO dto = modelMapper.map(
                    transaction,
                    TransactionResponseDTO.class
            );

            dto.setMatchId(transaction.getMatch().getId());
            dto.setBookId(transaction.getBook().getId());
            dto.setBookTitle(transaction.getBook().getTitle());
            dto.setProponentId(transaction.getProponent().getId());
            dto.setProponentName(transaction.getProponent().getName());
            dto.setRequesterId(transaction.getRequester().getId());
            dto.setRequesterName(transaction.getRequester().getName());

            return dto;
        });
    }

}

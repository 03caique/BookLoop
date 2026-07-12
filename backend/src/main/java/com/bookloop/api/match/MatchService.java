package com.bookloop.api.match;

import com.bookloop.api.bookrequest.BookRequest;
import com.bookloop.api.bookrequest.BookRequestRepository;
import com.bookloop.api.bookrequest.BookRequestStatus;
import com.bookloop.api.user.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final BookRequestRepository bookRequestRepository;

    public void checkForMatch(BookRequest acceptedRequest) {

        Long requesterId = acceptedRequest.getRequester().getId();
        Long ownerId = acceptedRequest.getBook().getUser().getId();

        Optional<BookRequest> reverseRequest =
                bookRequestRepository.findByRequesterIdAndBookUserIdAndStatus(
                        ownerId,
                        requesterId,
                        BookRequestStatus.ACEITA
                );

        if (reverseRequest.isEmpty()) {
            return;
        }

        BookRequest requestFromUserA;
        BookRequest requestFromUserB;
        User userA;
        User userB;

        if (requesterId < ownerId) {
            userA = acceptedRequest.getRequester();
            userB = acceptedRequest.getBook().getUser();

            requestFromUserA = acceptedRequest;
            requestFromUserB = reverseRequest.get();

        } else {
            userA = acceptedRequest.getBook().getUser();
            userB = acceptedRequest.getRequester();

            requestFromUserA = reverseRequest.get();
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

        matchRepository.save(match);
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
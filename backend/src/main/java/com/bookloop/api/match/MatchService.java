package com.bookloop.api.match;

import com.bookloop.api.bookrequest.BookRequest;
import com.bookloop.api.bookrequest.BookRequestRepository;
import com.bookloop.api.bookrequest.BookRequestStatus;
import com.bookloop.api.user.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

        BookRequest requestA = acceptedRequest;
        BookRequest requestB = reverseRequest.get();

        Long userAId = Math.min(requesterId, ownerId);
        Long userBId = Math.max(requesterId, ownerId);

        if (matchRepository.existsByUserAIdAndUserBId(
                userAId,
                userBId
        )) {
            return;
        }

        User userA;
        User userB;

        if (requesterId < ownerId) {
            userA = acceptedRequest.getRequester();
            userB = acceptedRequest.getBook().getUser();
        } else {
            userA = acceptedRequest.getBook().getUser();
            userB = acceptedRequest.getRequester();
        }

        Match match = new Match();

        match.setUserA(userA);
        match.setUserB(userB);

        match.setRequestFromUserA(requestA);
        match.setRequestFromUserB(requestB);

        matchRepository.save(match);
    }
}
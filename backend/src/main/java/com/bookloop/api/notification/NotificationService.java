package com.bookloop.api.notification;

import com.bookloop.api.book.dto.BookResponseDTO;
import com.bookloop.api.bookrequest.BookRequest;
import com.bookloop.api.security.LoggedUserService;
import com.bookloop.api.user.User;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final LoggedUserService loggedUserService;
    private final ModelMapper modelMapper;

    public void createRequestNotification(BookRequest bookRequest) {
        User owner = bookRequest.getBook().getUser();

        String requesterName = bookRequest.getRequester().getName();

        String title = bookRequest.getBook().getTitle();

        Notification notification = new Notification();

        notification.setUser(owner);
        notification.setType(NotificationType.SOLICITACAO_RECEBIDA);
        notification.setTitle("Nova solicitação recebida");
        notification.setMessage(requesterName + " demonstrou interesse no livro \"" + title + "\".");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        repository.save(notification);
    }

    public List<NotificationResponseDTO> findMyNotifications(NotificationType type){
        User loggedUser = loggedUserService.getLoggedUser();

        List<Notification> notificationList;

        if (type == null){
             notificationList = repository.findByUserIdOrderByCreatedAtDesc(loggedUser.getId());
        } else {
            notificationList = repository.findByUserIdAndTypeOrderByCreatedAtDesc(loggedUser.getId(), type);
        }

        return notificationList.stream()
                .map(notification -> modelMapper
                        .map(notification, NotificationResponseDTO.class))
                .collect(Collectors.toList());
    }

    public long countUnreadNotifications(){
        User loggedUser = loggedUserService.getLoggedUser();

        return repository.countByUserIdAndReadFalse(loggedUser.getId());
    }

    public void markAsRead(Long notificationId){
        User loggedUser = loggedUserService.getLoggedUser();

        Notification notification = repository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma notificação encontrada"));

        if(!notification.getUser().equals(loggedUser)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (!notification.getRead()) {
            notification.setRead(true);
            repository.save(notification);
        }
    }
}


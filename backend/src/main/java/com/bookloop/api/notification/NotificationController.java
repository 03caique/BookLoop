package com.bookloop.api.notification;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<NotificationResponseDTO> findMyNotifications(@RequestParam(required = false) NotificationType type){
        return service.findMyNotifications(type);
    }

    @GetMapping("/unread-count")
    @ResponseStatus(HttpStatus.OK)
    public long countUnreadNotifications(){
        return service.countUnreadNotifications();
    }

    @PutMapping("/{id}/read")
    @ResponseStatus(HttpStatus.OK)
    public void markAsRead(@PathVariable Long id){
        service.markAsRead(id);
    }
}

package com.bookloop.api.match;

import com.bookloop.api.bookrequest.BookRequest;
import com.bookloop.api.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User userA;

    @ManyToOne
    private User userB;

    @ManyToOne
    private BookRequest requestFromUserA;

    @ManyToOne
    private BookRequest requestFromUserB;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @NotNull
    private MatchStatus status;
}

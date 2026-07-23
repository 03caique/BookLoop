package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SocioeconomicProfileRepository extends JpaRepository<SocioeconomicProfile, Long> {

    boolean existsByUserId(Long userId);

    Optional<SocioeconomicProfile> findByUserId(Long userId);
}

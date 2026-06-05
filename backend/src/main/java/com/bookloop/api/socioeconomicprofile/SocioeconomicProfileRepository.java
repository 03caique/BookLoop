package com.bookloop.api.socioeconomicprofile;

import com.bookloop.api.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocioeconomicProfileRepository extends JpaRepository<SocioeconomicProfile, Long> {

    boolean existsByUserId(Long userId);
}

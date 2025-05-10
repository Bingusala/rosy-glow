package com.cosmetics.ecommerce.security;

import com.cosmetics.ecommerce.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {

    private final UserRepository userRepository;

    public UserSecurity(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean hasUserId(Authentication authentication, Long userId) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        
        return userRepository.findByUsername(username)
                .map(user -> user.getId().equals(userId))
                .orElse(false);
    }
} 
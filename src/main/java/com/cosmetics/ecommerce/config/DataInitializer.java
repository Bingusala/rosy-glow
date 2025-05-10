package com.cosmetics.ecommerce.config;

import com.cosmetics.ecommerce.model.Category;
import com.cosmetics.ecommerce.model.User;
import com.cosmetics.ecommerce.repository.CategoryRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, 
                          CategoryRepository categoryRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Admin User");
            admin.setActive(true);
            
            Set<User.Role> roles = new HashSet<>();
            roles.add(User.Role.ROLE_ADMIN);
            admin.setRoles(roles);
            
            userRepository.save(admin);
        }
        
        // Create default categories if not exist
        if (categoryRepository.count() == 0) {
            String[] defaultCategories = {
                "Skincare", "Makeup", "Hair Care", "Fragrance", "Bath & Body"
            };
            
            for (String name : defaultCategories) {
                Category category = new Category();
                category.setName(name);
                category.setDescription(name + " products");
                categoryRepository.save(category);
            }
        }
    }
} 
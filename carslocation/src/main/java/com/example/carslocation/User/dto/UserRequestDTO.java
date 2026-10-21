package com.example.carslocation.User.dto;

import com.example.carslocation.User.Role;
import com.example.carslocation.User.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserRequestDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        @NotBlank String password,
        String phone,
        @NotNull Role role,
        @NotNull UserStatus status
){}

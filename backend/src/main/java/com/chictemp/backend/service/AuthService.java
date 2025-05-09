package com.chictemp.backend.service;

import com.chictemp.backend.dto.LoginRequest;
import com.chictemp.backend.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    boolean validateToken(String token);
    String getUserRoleFromToken(String token);
} 
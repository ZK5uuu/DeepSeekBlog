package com.chictemp.backend.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {
    // 状态码，0表示成功，非0表示失败
    private int code;
    // 消息
    private String message;
    // 数据
    private T data;

    // 成功响应
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(0);
        response.setMessage("success");
        response.setData(data);
        return response;
    }

    // 成功响应（带自定义消息）
    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(0);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    // 错误响应
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(1);
        response.setMessage(message);
        return response;
    }

    // 错误响应（带自定义状态码）
    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
}
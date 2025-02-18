package com.first.tinder.dto.chatbot;

public class ChatBotResponse {
    private String response;

    public ChatBotResponse() {}

    public ChatBotResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}

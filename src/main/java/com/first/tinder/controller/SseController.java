package com.first.tinder.controller;

import com.first.tinder.service.SseEmitterService;
import com.first.tinder.util.SseEmitters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@RestController
@RequestMapping("/sse")
public class SseController {
    private final SseEmitterService sseEmitterService;

    public SseController(SseEmitterService sseEmitterService) {
        this.sseEmitterService = sseEmitterService;
    }

    @GetMapping("/subscribe/{memberId}")
    public SseEmitter subscribe(@PathVariable Integer memberId) {
        System.out.println("subscribe@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+memberId);
        return sseEmitterService.subscribe(memberId);
    }
}


package com.first.tinder.controller;

import com.first.tinder.dto.PaymentRequest;
import com.first.tinder.dto.PaymentResponse;
import com.first.tinder.entity.Ordering;
import com.first.tinder.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

//포트원 결제 위한 컨트롤러입니다.
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @Value("${portone.secret.api}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public PaymentController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/order")
    public ResponseEntity<?> order(@RequestParam("memberId") int memberId, @RequestParam("productId") int productId) {
        System.out.println("memberId"+memberId+"productId"+productId);
        Ordering ordering = paymentService.doOrder(memberId,productId);
        int orderId = ordering.getOrderingId();
        return ResponseEntity.ok(orderId);
    }




    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody PaymentRequest request) {
//        System.out.println("complete in");
//        System.out.println(request);
        try {
            PaymentResponse response = paymentService.verifyPayment(request);
//            System.out.println("complete success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
//            System.out.println("complete fail");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

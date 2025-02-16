package com.first.tinder.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String paymentId;
    private int memberId;
    private Long orderId;
}

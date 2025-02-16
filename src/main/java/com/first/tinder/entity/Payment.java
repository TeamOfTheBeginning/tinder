package com.first.tinder.entity;

import lombok.Data;

@Data
public class Payment {
    private String status;
    private PaymentAmount amount;

    @Data
    public static class PaymentAmount {
        private Integer total;
    }
}

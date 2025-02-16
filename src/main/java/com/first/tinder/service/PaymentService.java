package com.first.tinder.service;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dto.PaymentRequest;
import com.first.tinder.dto.PaymentResponse;


import com.first.tinder.entity.Member;
import com.first.tinder.entity.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RestTemplate restTemplate;

    private final MemberRepository mr;

    @Value("${portone.secret.api}")
    private String portOneApiSecret;

    public PaymentResponse verifyPayment(PaymentRequest request) {
        String paymentId = request.getPaymentId();
        int memberId = request.getMemberId();
        Long orderId = request.getOrderId();

        // 1. PortOne 결제 내역 조회
        String url = "https://api.portone.io/payments/" + URLEncoder.encode(paymentId, StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "PortOne " + portOneApiSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Payment> response = restTemplate.exchange(url, HttpMethod.GET, entity, Payment.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("PortOne API 호출 실패");
        }

        Payment payment = response.getBody();

        // 2. 주문 데이터 조회 및 결제 금액 비교
//        Order order = orderRepository.findById(orderId)
//                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없음"));

//        if (!order.getAmount().equals(payment.getAmount().getTotal())) {
//            throw new RuntimeException("결제 금액 불일치 - 위변조 의심");
//        }

        // 3. 결제 상태 확인 후 처리
        switch (payment.getStatus()) {
            case "VIRTUAL_ACCOUNT_ISSUED":
                return new PaymentResponse("VIRTUAL_ACCOUNT_ISSUED", "가상 계좌 발급 완료");

            case "PAID":
                System.out.println("결제완료");
                Optional<Member> member = mr.findById(memberId);
                if (member.isPresent()) {
                    member.get().setAccount(member.get().getAccount()+1);
                    System.out.println("member.get()"+member.get());
                    System.out.println("member.get().getAccount()"+member.get().getAccount());
                    mr.save(member.get());
                }
                return new PaymentResponse("PAID", "결제 완료");

            default:
                throw new RuntimeException("알 수 없는 결제 상태: " + payment.getStatus());
        }
    }
}

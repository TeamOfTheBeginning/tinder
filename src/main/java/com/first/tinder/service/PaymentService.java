package com.first.tinder.service;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dao.OrderingRepository;
import com.first.tinder.dao.ProductRepository;
import com.first.tinder.dto.PaymentRequest;
import com.first.tinder.dto.PaymentResponse;


import com.first.tinder.entity.Member;
import com.first.tinder.entity.Ordering;
import com.first.tinder.entity.Payment;
import com.first.tinder.entity.Product;
import jakarta.transaction.Transactional;
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
@Transactional
public class PaymentService {

    private final RestTemplate restTemplate;

    private final MemberRepository mr;

    private final ProductRepository pr;

    private final OrderingRepository or;

    @Value("${portone.secret.api}")
    private String portOneApiSecret;

    public PaymentResponse verifyPayment(PaymentRequest request) {
        String paymentId = request.getPaymentId();
        int memberId = request.getMemberId();
        int orderingId = request.getOrderingId();

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

//        System.out.println("payment"+payment);
//        System.out.println("payment.getAmount()"+payment.getAmount());
//        System.out.println("payment.getAmount().getTotal())"+payment.getAmount().getTotal());

        int fromprice =  payment.getAmount().getTotal();

        // 2. 주문 데이터 조회 및 결제 금액 비교
        Ordering ordering = or.findById(orderingId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없음"));

        int price = ordering.getProduct().getProductPrice();

//        System.out.println("ordering"+ordering);
//
//        System.out.println("price!=(payment.getAmount().getTotal())"+(price!=(payment.getAmount().getTotal())));
//        if (!price.equals(payment.getAmount().getTotal())) {
//            throw new RuntimeException("결제 금액 불일치 - 위변조 의심");
//        }

        if (price!=(payment.getAmount().getTotal())) {
            System.out.println("위변조!!");
            throw new RuntimeException("결제 금액 불일치 - 위변조 의심");
        }

        // 3. 결제 상태 확인 후 처리
        switch (payment.getStatus()) {
            case "VIRTUAL_ACCOUNT_ISSUED":
                return new PaymentResponse("VIRTUAL_ACCOUNT_ISSUED", "가상 계좌 발급 완료");

            case "PAID":
                System.out.println("결제완료");
                Optional<Member> member = mr.findById(memberId);
                if (member.isPresent()) {
                    Product product = pr.findById(1).orElse(null);
                    System.out.println(product);

                    member.get().setAccount(member.get().getAccount()+product.getProductPrice());
                    System.out.println("member.get()"+member.get());
                    System.out.println("member.get().getAccount()"+member.get().getAccount());
                    mr.save(member.get());
                }
                return new PaymentResponse("PAID", "결제 완료");

            default:
                throw new RuntimeException("알 수 없는 결제 상태: " + payment.getStatus());
        }
    }

    public Ordering doOrder(int memberId, int productId) {
        Member member = mr.findById(memberId).get();
        Product product = pr.findById(productId).get();

        Ordering ordering = new Ordering();
        ordering.setMember(member);
        ordering.setProduct(product);
        return or.save(ordering);
    }
}

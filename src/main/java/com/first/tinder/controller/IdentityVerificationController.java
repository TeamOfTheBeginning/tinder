package com.first.tinder.controller;

import com.first.tinder.util.IdentityVerificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/identityVerifications")
public class IdentityVerificationController {

    @Value("${portone.secret.api}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public IdentityVerificationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/verifyIdentity")
    public ResponseEntity<String> verifyIdentity(@RequestBody IdentityVerificationRequest request) {
        System.out.println("Verifying identity"+ request);

        String identityVerificationId = request.getIdentityVerificationId();

        String url = "https://api.portone.io/identity-verifications/" + identityVerificationId;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "PortOne " + apiSecret);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 외부 API 호출
            ResponseEntity<String> verificationResponse = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // API 호출 성공, 인증 상태 확인
            if (verificationResponse.getStatusCode().is2xxSuccessful()) {
                // 인증 정보 파싱 (예: JSON)
                String responseBody = verificationResponse.getBody();
                if (responseBody != null && responseBody.contains("\"status\":\"VERIFIED\"")) {
                    // 인증 성공
                    return ResponseEntity.ok("Identity Verified");
                } else {
                    // 인증 실패
                    return ResponseEntity.status(400).body("Verification Failed");
                }
            } else {
                return ResponseEntity.status(500).body("API Error");
            }
        } catch (HttpClientErrorException e) {
            // API 호출 실패 시
            return ResponseEntity.status(e.getStatusCode()).body("API Request Failed");
        }

//        System.out.println("ResponseEntity"+ResponseEntity);
    }
}

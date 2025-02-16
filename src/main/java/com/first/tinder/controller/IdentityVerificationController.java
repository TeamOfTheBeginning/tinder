package com.first.tinder.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.first.tinder.dto.IdentityVerificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.HashMap;

@RestController
@RequestMapping("/identityVerifications")
public class IdentityVerificationController {

    @Value("${portone.secret.api}")
    private String apiSecret;

    private final RestTemplate restTemplate;

    public IdentityVerificationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/verifyIdentity1")
    public ResponseEntity<HashMap<String, String>> verifyIdentity1(@RequestBody IdentityVerificationRequest request) {
        HashMap<String, String> responseMap = new HashMap<>();
//        System.out.println("verifyIdentity1"+request);

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

                System.out.println("responseBody"+responseBody);

                if (responseBody != null && responseBody.contains("\"status\":\"VERIFIED\"")) {
                    // 인증 성공

                    // 인증 정보 파싱
                    // API 응답에서 인증 정보를 파싱해야 합니다 (ci, di, name, gender, birthDate)
                    String ci = getVerifiedCustomerInfo(verificationResponse.getBody(), "ci");
                    String di = getVerifiedCustomerInfo(verificationResponse.getBody(), "di");
                    String name = getVerifiedCustomerInfo(verificationResponse.getBody(), "name");
                    String phoneNumber = getVerifiedCustomerInfo(verificationResponse.getBody(), "phoneNumber");
                    String gender = getVerifiedCustomerInfo(verificationResponse.getBody(), "gender");
                    String birthDate = getVerifiedCustomerInfo(verificationResponse.getBody(), "birthDate");
//                    System.out.println("ci"+ci);
//                    System.out.println("di"+di);
//                    System.out.println("name"+name);
//                    System.out.println("gender"+gender);
//                    System.out.println("birthDate"+birthDate);

                    if (isAdultByKoreanLaw(birthDate)) {


                        responseMap.put("message", "Age restriction satisfied");
                        responseMap.put("name", name);
                        responseMap.put("phoneNumber", phoneNumber);
                        responseMap.put("gender", gender);
                        responseMap.put("birthDate", birthDate);

                        // 연령 만족
//                        System.out.println("연령 만족!");
                        return ResponseEntity.ok(responseMap);
                    } else {
                        responseMap.put("message", "Age restriction not satisfied");
                        // 연령 미달
                        return ResponseEntity.status(400).body(responseMap);
                    }
                } else {
                    responseMap.put("message", "Verification Failed");
                    // 인증 실패
                    return ResponseEntity.status(400).body(responseMap);
                }
            } else {
                responseMap.put("message", "API Error");
                return ResponseEntity.status(500).body(responseMap);
            }

        } catch (Exception e) {
            e.printStackTrace();
            responseMap.put("message", "API Request Failed");
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 인증 정보 파싱 예시
    public String getVerifiedCustomerInfo(String response, String field) {
        try {
            // JSON 문자열을 JsonNode로 변환
            JsonNode rootNode = objectMapper.readTree(response);

            // "verifiedCustomer" 노드 찾기
            JsonNode verifiedCustomerNode = rootNode.path("verifiedCustomer");

            // 특정 필드 값 가져오기
            return verifiedCustomerNode.path(field).asText();
        } catch (Exception e) {
            e.printStackTrace();
            return null; // 오류 발생 시 null 반환
        }
    }

    public static boolean isAdultByKoreanLaw(String birthDate) {
        // 출생 연도 추출
        int birthYear = Integer.parseInt(birthDate.split("-")[0]);
        int currentYear = LocalDate.now().getYear();

        // 청소년보호법 기준으로 성인 여부 판단
        return birthYear <= (currentYear - 19);
    }
}

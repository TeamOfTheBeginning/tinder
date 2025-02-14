package com.first.tinder.controller;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.entity.Member;
import com.first.tinder.util.IdentityVerificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

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


    @Autowired
    private MemberRepository userRepository;  // UserRepository는 DB에 접근하는 리포지토리입니다.

    @PostMapping("/verifyIdentity1")
    public ResponseEntity<String> verifyIdentity1(@RequestBody IdentityVerificationRequest request) {
        System.out.println("verifyIdentity1"+request);

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


                    // 인증 정보 파싱
                    // API 응답에서 인증 정보를 파싱해야 합니다 (ci, di, name, gender, birthDate)
                    String ci = getVerifiedCustomerInfo(verificationResponse.getBody(), "ci");
                    String di = getVerifiedCustomerInfo(verificationResponse.getBody(), "di");
                    String name = getVerifiedCustomerInfo(verificationResponse.getBody(), "name");
                    String gender = getVerifiedCustomerInfo(verificationResponse.getBody(), "gender");
                    String birthDate = getVerifiedCustomerInfo(verificationResponse.getBody(), "birthDate");


                    System.out.println("birthDate"+birthDate);

                    if (Integer.parseInt(birthDate.split("-")[0]) <= 1999) {
                        // 연령 만족
                        return ResponseEntity.ok("Age restriction satisfied");
                    } else {
                        // 연령 미달
                        return ResponseEntity.status(400).body("Age restriction not satisfied");
                    }



//                    return ResponseEntity.ok("Identity Verified");
                } else {




                    // 인증 실패
                    return ResponseEntity.status(400).body("Verification Failed");
                }
            } else {
                return ResponseEntity.status(500).body("API Error");
            }



//            // identityVerificationId로 인증 정보 조회
//            String identityVerificationId = request.getIdentityVerificationId();
//
//            // 포트원 API 호출 (예시: fetch로 호출된 API 응답 처리)
//            String verificationResponse = callPortOneApi(identityVerificationId);

            // 인증 정보 파싱
            // API 응답에서 인증 정보를 파싱해야 합니다 (ci, di, name, gender, birthDate)
//            String ci = getVerifiedCustomerInfo(verificationResponse, "ci");
//            String di = getVerifiedCustomerInfo(verificationResponse, "di");
//            String name = getVerifiedCustomerInfo(verificationResponse, "name");
//            String gender = getVerifiedCustomerInfo(verificationResponse, "gender");
//            String birthDate = getVerifiedCustomerInfo(verificationResponse, "birthDate");

            // 연령 제한 로직
//            if (Integer.parseInt(birthDate.split("-")[0]) <= 1999) {
//                // 연령 만족
//                return ResponseEntity.ok("Age restriction satisfied");
//            } else {
//                // 연령 미달
//                return ResponseEntity.status(400).body("Age restriction not satisfied");
//            }

            // 1인 1계정 허용 로직
//            if (di == null) {
//                // PG사에서 di를 미제공
//                return ResponseEntity.status(400).body("DI not provided");
//            } else {
//                // DB에서 di 조회 후 가입 여부 검사
//                Optional<Member> user = userRepository.findByDi(di);
//                if (!user.isPresent()) {
//                    // 신규 고객
//                    return ResponseEntity.ok("New customer");
//                } else {
//                    // 이미 가입된 고객
//                    return ResponseEntity.status(400).body("Already registered customer");
//                }
//            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("API Request Failed");
        }
    }

    // 포트원 API 호출 메소드 (예시)
    private String callPortOneApi(String identityVerificationId) {
        // 실제로 포트원 API 호출하는 로직을 구현해야 합니다.
        // 예시에서는 응답값을 직접 리턴하는 형태로 작성합니다.
        return "{ \"verifiedCustomer\": { \"ci\": \"ciValue\", \"di\": \"diValue\", \"name\": \"John\", \"gender\": \"Male\", \"birthDate\": \"1995-05-15\" } }";
    }

    // 인증 정보 파싱 예시
    private String getVerifiedCustomerInfo(String response, String field) {
        // API 응답에서 특정 필드 값을 파싱하는 예시입니다.
        // 실제 JSON 파싱을 할 때는 라이브러리(JsonPath 등)를 사용하여 파싱합니다.
        return "someValue";  // 실제로는 적절한 값을 리턴
    }
}

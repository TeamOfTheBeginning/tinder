package com.first.tinder.entity.chatbot;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jongro_restaurants") // 테이블 이름을 정확히 맞춤
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatJongroRestaurants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(name = "business_name", length = 100)
    private String businessName;

    @Column(name = "business_type", length = 50)
    private String businessType;
}

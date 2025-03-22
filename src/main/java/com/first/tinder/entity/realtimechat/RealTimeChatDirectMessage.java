//package com.first.tinder.entity.realtimechat;
//
//import com.first.tinder.entity.Member;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class RealTimeChatDirectMessage {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    private Member sender;
//
//    @ManyToOne
//    private Member receiver;
//
//    private String content;
//
//    private LocalDateTime timestamp;
//}

package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatGroupQuiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_group_quiz_id")
    private Integer chatGroupQuizId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chat_group_id")
    ChatGroup chatGroup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id")
    Quiz quiz;

//    @CreationTimestamp
    private Timestamp transmissionTime;
}

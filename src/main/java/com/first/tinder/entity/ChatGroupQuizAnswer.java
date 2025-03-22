package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatGroupQuizAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_group_quiz_answer_id")
    private Integer chatGroupQuizAnswerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chat_group_quiz_id")
    ChatGroupQuiz chatGroupQuiz;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    Member member;

    private int answer;
}

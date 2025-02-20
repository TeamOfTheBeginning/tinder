package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserOnline {
    @Id
    private int memberId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "memberId", referencedColumnName = "member_id")
    private Member member;
}
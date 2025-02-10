package com.foodie.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private int memberId;
    private String nickname;
    private String email;
    private String pwd;
    private String phone;
    private boolean gender;
    private String profileImg;
    private String profileMsg;
    private String snsId;
    private String provider;
    private String zipnum;
    private String address;
    private int account;
}

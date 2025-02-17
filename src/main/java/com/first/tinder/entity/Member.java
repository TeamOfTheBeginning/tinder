package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private int memberId;
    private String nickname;
    private String memberName;
    private String email;
    private String pwd;
    private String phone;
    @Column(columnDefinition = "TINYINT")
    private int gender;
    private int age;
    private int account;
    @Temporal(TemporalType.DATE)
    private Date birthDate;
    private Double latitude;
    private Double longitude;
    private String profileImg;
    private String profileMsg;
    private String snsId;
    private String provider;
    private String zipnum;
    private String address;

    private int temp;  // 기본값을 Java에서 설정

    @Column(columnDefinition = "TINYINT")
    private int ei=0;

    @Column(columnDefinition = "TINYINT")
    private int ns=0;

    @Column(columnDefinition = "TINYINT")
    private int tf=0;

    @Column(columnDefinition = "TINYINT")
    private int jp=0;

    @ElementCollection(fetch = FetchType.EAGER)  // 테이블의 리스트가 아니라 단순데이터(String, Integer 등)이라고 MySQL 에 알려주는 어너테이션
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<MemberRole>();
}

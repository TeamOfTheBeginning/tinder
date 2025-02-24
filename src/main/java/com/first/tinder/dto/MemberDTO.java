package com.first.tinder.dto;

import com.first.tinder.entity.MemberInfo;
import com.first.tinder.entity.OpponentMemberInfo;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.*;
import java.util.stream.Collectors;

public class MemberDTO extends User {
    public MemberDTO(String username, String password, int memberId, String nickname, String memberName, String phone, int gender, int age, Date birthDate,  int account, String zipnum, String address, Double latitude, Double longitude, String profileImg, String profileMsg, String snsId, String provider, int temp, List<String> authorities
            , MemberInfo memberInfo, OpponentMemberInfo opponentMemberInfo) {
        super(username, password,
                authorities.stream()
                        .map( str -> new SimpleGrantedAuthority("ROLE_"+str) )
                        .collect(Collectors.toList()));
        this.memberId = memberId;
        this.email= username;
        this.pwd = password;

        this.nickname = nickname;
        this.memberName = memberName;

        this.phone = phone;
        this.gender = gender;
        this.age = age;

        this.birthDate = birthDate;
        this.account = account;

        this.zipnum = zipnum;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;

        this.profileImg = profileImg;
        this.profileMsg = profileMsg;

        this.snsId = snsId;
        this.provider = provider;

        this.temp = temp;

        this.roleNames = authorities;

        this.memberInfo = memberInfo;
        this.opponentMemberInfo = opponentMemberInfo;
    }
    private int memberId;
    private String email;
    private String pwd;
    private String nickname;
    private String memberName;

    private String phone;
    private int gender;
    private int age;
    private Date birthDate;
    private int account;

    private String zipnum;
    private String address;
    private Double latitude;
    private Double longitude;

    private String profileImg;
    private String profileMsg;

    private String snsId;
    private String provider;

    private int temp;

    private List<String> roleNames = new ArrayList<String>();

    MemberInfo memberInfo;
    OpponentMemberInfo opponentMemberInfo;

    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("memberId", memberId);
        dataMap.put("email", email);
        dataMap.put("pwd",pwd);
        dataMap.put("nickname", nickname);
        dataMap.put("memberName", memberName);
        dataMap.put("phone", phone);
        dataMap.put("gender",gender);
        dataMap.put("age",age);
        dataMap.put("birthDate",birthDate);
        dataMap.put("account",account);
        dataMap.put("zipnum",zipnum);
        dataMap.put("address",address);
        dataMap.put("latitude",latitude);
        dataMap.put("longitude",longitude);

        dataMap.put("profileImg", profileImg);
        dataMap.put("profileMsg", profileMsg);

        dataMap.put("snsId", snsId);
        dataMap.put("provider", provider);

        dataMap.put("temp", temp);

        dataMap.put("roleNames", roleNames);
        dataMap.put("memberInfo", memberInfo);
        dataMap.put("opponentMemberInfo", opponentMemberInfo);
        return dataMap;
    }
}
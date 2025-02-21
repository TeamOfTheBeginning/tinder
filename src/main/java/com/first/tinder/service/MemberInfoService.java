package com.first.tinder.service;

import com.first.tinder.dao.MemberInfoRepository;
import com.first.tinder.entity.MemberInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MemberInfoService {

    @Autowired
    MemberInfoRepository memberInfoRepository;

    public MemberInfo getMemberInfoById(int memberId) {
        return memberInfoRepository.findById(memberId)
                .orElse(null);
    }

    public void updateMemberInfo(MemberInfo memberInfo) {
//        memberInfo.setHobbies(memberInfo.getHobbies());
        memberInfoRepository.save(memberInfo);
    }
}

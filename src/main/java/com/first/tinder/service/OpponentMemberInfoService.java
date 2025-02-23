package com.first.tinder.service;

import com.first.tinder.dao.OpponentMemberInfoRepository;
import com.first.tinder.entity.OpponentMemberInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OpponentMemberInfoService {

    @Autowired
    private OpponentMemberInfoRepository opponentMemberInfoRepository;

    public void updateOpponentMemberInfo(OpponentMemberInfo opponentMemberInfo) {
        opponentMemberInfoRepository.save(opponentMemberInfo);
    }

    public OpponentMemberInfo insertOpponentMemberInfo(OpponentMemberInfo opponentMemberInfo) {
        return opponentMemberInfoRepository.save(opponentMemberInfo);
    }
}

package com.first.tinder.dao;

import com.first.tinder.entity.MemberInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberInfoRepository extends JpaRepository<MemberInfo, Integer> {
}

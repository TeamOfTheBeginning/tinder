package com.first.tinder.dao;

import com.first.tinder.entity.UserOnline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserOnlineRepository extends JpaRepository<UserOnline, Long> {
}

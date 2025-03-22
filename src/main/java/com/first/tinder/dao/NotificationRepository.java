package com.first.tinder.dao;

import com.first.tinder.entity.Member;
import com.first.tinder.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findTop4ByMemberAndReadOnNotFalseOrderByNotificationIdDesc(Optional<Member> member);

}

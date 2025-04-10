package com.first.tinder.service;

import com.first.tinder.dao.MemberRepository;
import com.first.tinder.dao.NotificationRepository;
import com.first.tinder.entity.Member;
import com.first.tinder.entity.Notification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    NotificationRepository nr;

    @Autowired
    MemberRepository mr;


    public List<Notification> getNotifications(int memberId) {
        List<Notification> notifications ;
        Optional<Member> member  = mr.findById(memberId);
        if (member.isPresent()) {

            notifications = nr.findTop4ByMemberAndReadOnNotFalseOrderByNotificationIdDesc(member);
            System.out.println("notifications"+notifications);
            System.out.println("맴버가 있습니다.");
        }else{
            System.out.println("맴버가 없습니다.");
            notifications = null;
        }

        return notifications;
    }

    public void updateNotificationRead(int notificationId) {
        Optional<Notification> notification = nr.findById(notificationId);
        if(notification.isPresent()) {
            Notification updateNotification = notification.get();
            updateNotification.setReadOnNot(1);
            System.out.println("알림을 읽음 처리 했습니다.");
        }



    }
}

package com.first.tinder.controller;

import com.first.tinder.entity.Notification;
import com.first.tinder.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationService ns;

    //최근 4개 알람을 조회합니다.
    @GetMapping("/getNotificationTop4")
    public HashMap<String,Object> getNotificationTop4(@RequestParam("memberId") int memberId) {
        HashMap<String,Object> result = new HashMap<>();
        List<Notification> notifications = ns.getNotifications(memberId);
//        System.out.println(notifications);
        result.put("notificationList", notifications);
        return result;
    }

    //알림을 읽음 처리합니다.
    @PostMapping("/updateNotificationRead")
    public HashMap<String, Object> updateNotificationRead(@RequestParam("notificationId") int notificationId , @RequestParam("memberId") int memberId) {
        HashMap<String,Object> result = new HashMap<>();
//        System.out.println("notificationId"+notificationId);
        ns.updateNotificationRead(notificationId);

        List<Notification> notifications = ns.getNotifications(memberId);
//        System.out.println(notifications);
        result.put("notificationList", notifications);
        return result;
    }

}

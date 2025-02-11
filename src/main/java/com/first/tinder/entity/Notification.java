package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private int notificationId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    Member member;

    private String messagefrom;
    private String message;

    @Column(name = "read_on_not")
    private boolean readOnNot;

    @CreationTimestamp
    private Timestamp indate;
}

package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class Ordering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ordering_id")
    private int orderingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    Product product;

    @CreationTimestamp
    private Timestamp indate;
}

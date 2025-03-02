package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Ads {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ad_id")
    private int adId;
    private String advertiser;
    private String adImage;
}

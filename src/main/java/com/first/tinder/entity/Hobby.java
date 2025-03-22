package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Hobby {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hobby_id")
    private int hobbyId;

    @Column(name = "hobby_name")
    private String hobbyName;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private HobbyCategory category;
}

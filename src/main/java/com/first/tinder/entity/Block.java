package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Block {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "block_id")
    private Integer blockId;

    @ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
    @JoinColumn(name = "blocker")  // 외래 키 컬럼 이름 지정
    private Member blocker;  // Member 엔티티와 연관됨

    @ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
    @JoinColumn(name = "blocked")  // 외래 키 컬럼 이름 지정
    private Member blocked;  // Member 엔티티와 연관됨

}

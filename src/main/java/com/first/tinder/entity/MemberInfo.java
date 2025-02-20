package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class MemberInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_info_id")
    private int memberInfoId;

    @Column(columnDefinition = "TINYINT")
    private int ei=0;

    @Column(columnDefinition = "TINYINT")
    private int ns=0;

    @Column(columnDefinition = "TINYINT")
    private int tf=0;

    @Column(columnDefinition = "TINYINT")
    private int jp=0;
}

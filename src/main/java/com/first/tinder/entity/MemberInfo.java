package com.first.tinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.util.List;

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

    @Column(columnDefinition = "TINYINT")
    private int smoke=0;

    private int alcohol;

    private int speed;

    private int date;

    private int workout;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "member_hobby",
            joinColumns = @JoinColumn(name = "member_info_id"),
            inverseJoinColumns = @JoinColumn(name = "hobby_id")
    )
    private List<Hobby> hobbies;
}

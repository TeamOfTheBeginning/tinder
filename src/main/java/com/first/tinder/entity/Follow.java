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
public class Follow {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "follow_id")
	private Integer followId;

	@ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
	@JoinColumn(name = "follower")  // 외래 키 컬럼 이름 지정
	private Member follower;  // Member 엔티티와 연관됨

	@ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
	@JoinColumn(name = "followed")  // 외래 키 컬럼 이름 지정
	private Member followed;  // Member 엔티티와 연관됨


}

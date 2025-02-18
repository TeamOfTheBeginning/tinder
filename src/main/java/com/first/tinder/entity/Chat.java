package com.first.tinder.entity;

import java.sql.Timestamp;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Chat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "chat_id")
	private Integer chatId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "chat_group_id")
	ChatGroup chatGroup;
//	private Integer chatGroupId;

	@ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
	@JoinColumn(name = "sender")  // 외래 키 컬럼 이름 지정
	private Member sender;  // Member 엔티티와 연관됨

//	private String sender;
//	private String receiver;
	private String content;

	@CreationTimestamp
	private Timestamp createdDate;
}

package com.foodie.tinder.entity;

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
	private String sender;
//	private String receiver;
	private String content;

	@CreationTimestamp
	private Timestamp createdat;
}

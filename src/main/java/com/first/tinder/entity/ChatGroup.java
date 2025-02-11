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
public class ChatGroup {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "chat_group_id")
	private Integer chatGroupId;

	private String createdby;
	private Integer memberCount;
	
	public ChatGroup(String createdby, Integer membercount) {
		this.createdby = createdby;
		this.memberCount = membercount;
	}
}

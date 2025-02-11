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
public class ChatGroupMember {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "chat_group_member_id")
	private Integer chatGroupMemberId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "chat_group_id")
	ChatGroup chatGroup;

	private String nickname;
	
	public ChatGroupMember(Integer chatgroupid, String nickname) {
//		this.chatgroupid = chatgroupid;
		this.nickname = nickname;
	}
}

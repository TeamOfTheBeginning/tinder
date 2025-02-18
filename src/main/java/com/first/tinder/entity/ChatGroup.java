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

	@ManyToOne(fetch = FetchType.EAGER)  // Many ChatGroups can be created by one Member
	@JoinColumn(name = "created_by")  // 외래 키 컬럼 이름 지정
	private Member createdBy;  // Member 엔티티와 연관됨

	private String chatGroupName;

	private Integer memberCount;

	@Column(columnDefinition = "TINYINT")
	private int anonymity=0;
	
	public ChatGroup(Member createdby, Integer membercount) {
		this.createdBy = createdby;
		this.memberCount = membercount;
	}
}

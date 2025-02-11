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
public class PostMention {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "post_mention_id")
	private Integer postMentionId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "post_id")
	Post post;

	private String nickname;

}

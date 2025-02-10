package com.foodie.tinder.entity;

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
public class PostHashtag {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "post_hash_id")
	private Integer postHashId;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "post_id")
	Post post;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "hashtag_id")
	Hashtag hashtag;
}

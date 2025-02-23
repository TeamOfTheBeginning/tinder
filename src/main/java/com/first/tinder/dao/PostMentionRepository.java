package com.first.tinder.dao;

import com.first.tinder.entity.PostMention;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostMentionRepository extends JpaRepository<PostMention, Long> {
}

package com.first.tinder.dao;

import com.first.tinder.entity.Post;
import com.first.tinder.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Optional<Reply> findByReplyId(int replyId);

    List<Reply> findByPostOrderByReplyIdDesc(Post post);
}

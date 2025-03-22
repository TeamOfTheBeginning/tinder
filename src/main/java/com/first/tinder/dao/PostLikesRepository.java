package com.first.tinder.dao;


import com.first.tinder.entity.Member;
import com.first.tinder.entity.Post;
import com.first.tinder.entity.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostLikesRepository extends JpaRepository<PostLikes, Integer> {
    List<PostLikes> findByPost(Post post);

    Optional<PostLikes> findByPostAndMember(Post post, Member member);

}

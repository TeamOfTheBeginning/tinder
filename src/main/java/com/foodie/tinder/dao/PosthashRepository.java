package com.foodie.tinder.dao;


import com.foodie.tinder.entity.Hashtag;
import com.foodie.tinder.entity.PostHashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PosthashRepository extends JpaRepository<PostHashtag, Integer> {

    List<PostHashtag> findByHashtag(Hashtag hashtag);
}

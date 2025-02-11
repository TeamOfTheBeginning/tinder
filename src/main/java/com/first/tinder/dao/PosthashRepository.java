package com.first.tinder.dao;


import com.first.tinder.entity.Hashtag;
import com.first.tinder.entity.PostHashtag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PosthashRepository extends JpaRepository<PostHashtag, Integer> {

    List<PostHashtag> findByHashtag(Hashtag hashtag);
}

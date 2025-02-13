package com.first.tinder.dao;


import com.first.tinder.entity.Images;
import com.first.tinder.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagesRepository extends JpaRepository<Images, Integer> {
    List<Images> findByPost(Post post);
}

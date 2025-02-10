package com.foodie.tinder.dao;


import com.foodie.tinder.entity.Images;
import com.foodie.tinder.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagesRepository extends JpaRepository<Images, Integer> {

    List<Images> findByPost(Post post);
}

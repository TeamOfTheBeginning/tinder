package com.first.tinder.dao;

import com.first.tinder.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.nio.ByteBuffer;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

//    List<Post> findByPostIdIn(java.util.List<java.lang.Integer> poistidList);

//    List<Post> findByWriter(int writer);


    @Query("select p from Post p where p.postId in" +
            "(select ph.post.postId from PostHashtag ph where ph.postHashId=:hashid) ")
    List<Post> getPostListByTag(@Param("hashid") int hashid );


    Post findByPostId(int postid);
}
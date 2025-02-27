package com.first.tinder.dao;

import com.first.tinder.entity.Hashtag;
import com.first.tinder.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.nio.ByteBuffer;
import java.sql.Timestamp;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

//    List<Post> findByPostIdIn(java.util.List<java.lang.Integer> poistidList);

//    List<Post> findByWriter(int writer);


    @Query("select p from Post p where p.postId in" +
            "(select ph.post.postId from PostHashtag ph where ph.postHashId=:hashid) ")
    List<Post> getPostListByTag(@Param("hashid") int hashid );


    Post findByPostId(int postid);

    @Query("select p from Post p where p.writedate >= :threeDaysAgo order by function('RAND')")
    List<Post> findRandomPostWithinLast3Days(@Param("threeDaysAgo") Timestamp threeDaysAgo, Pageable pageable);

    Page<Post> findAllByOrderByPostIdDesc(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.postId IN " +
            "(SELECT ph.post.postId FROM PostHashtag ph WHERE ph.hashtag.hashtagId = :hashtagId) " +
            "ORDER BY p.postId DESC")
    Page<Post> findAllByHashtagId(@Param("hashtagId") int hashtagId, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.postId IN " +
            "(SELECT ph.post.postId FROM PostHashtag ph WHERE ph.hashtag IN :hashtags) " +
            "ORDER BY p.postId DESC")
    Page<Post> findAllByHashtags(@Param("hashtags") List<Hashtag> hashtags, Pageable pageable);
}
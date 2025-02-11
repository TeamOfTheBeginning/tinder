package com.first.tinder.service.dao;

import com.first.tinder.entity.Post;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostDao {

    @Autowired
    EntityManager em;


    public List<Post> getPostListByPaging(int startNum, int displayRow) {
        String spql = "select p from Post p order by p.postId desc";
        Query query = em.createQuery(spql);
        query.setFirstResult(startNum);
        query.setMaxResults(displayRow);
        return query.getResultList();
    }



    public List<Post> getPostListByTagByPage(int hashtagId, int startNum, int displayRow) {
        String spql = "select p from Post p where p.postId in" +
                "(select ph.post.postId from PostHashtag ph where ph.hashtag.hashtagId=:hashtagId)";
        Query query = em.createQuery(spql);
        query.setParameter("hashtagId", hashtagId);
        query.setFirstResult(startNum);
        query.setMaxResults(displayRow);
        return query.getResultList();
    }
}

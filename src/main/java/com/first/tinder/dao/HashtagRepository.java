package com.first.tinder.dao;


import com.first.tinder.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Integer> {

    Optional<Hashtag> findByWord(String tag);

    @Query("SELECT h FROM Hashtag h WHERE h.word LIKE %:word%")
    List<Hashtag> findByWordContaining(@Param("word") String word);
}

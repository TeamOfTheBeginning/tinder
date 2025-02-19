package com.first.tinder.dao;

import com.first.tinder.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {

    @Query(value = "SELECT * FROM quiz ORDER BY RAND() LIMIT 3", nativeQuery = true)
    List<Quiz> findThreeRandomQuizzes();

}

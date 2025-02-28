package com.first.tinder.dao.chatbot;

import com.first.tinder.entity.chatbot.ChatJongroRestaurants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JongroRestaurantRepository extends JpaRepository<ChatJongroRestaurants, Long> {
    @Query("SELECT r FROM ChatJongroRestaurants r WHERE r.businessType = :businessType ORDER BY FUNCTION('RAND')")
    List<ChatJongroRestaurants> findRandomRestaurantsByType(String businessType);
}

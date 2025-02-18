package com.first.tinder.dao;

import com.first.tinder.entity.HobbyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HobbyCategoryRepository extends JpaRepository<HobbyCategory, Integer> {
}

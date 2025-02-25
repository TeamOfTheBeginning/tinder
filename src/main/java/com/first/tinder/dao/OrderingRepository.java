package com.first.tinder.dao;

import com.first.tinder.entity.Ordering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderingRepository extends JpaRepository<Ordering, Integer> {
}

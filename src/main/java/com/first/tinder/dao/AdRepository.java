package com.first.tinder.dao;

import com.first.tinder.entity.Ads;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdRepository extends JpaRepository<Ads, Integer> {

}

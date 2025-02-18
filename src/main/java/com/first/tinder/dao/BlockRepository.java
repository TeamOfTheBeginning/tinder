package com.first.tinder.dao;

import com.first.tinder.entity.Block;
import com.first.tinder.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlockRepository extends JpaRepository<Block, Long> {
    List<Block> findAllByBlocker(Member m);

    List<Block> findAllByBlocked(Member me);

    boolean existsByBlockerAndBlocked(Member sender, Member member);
}

package com.example.demo.repository;

import com.example.demo.domain.PurchasedCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchasedCardRepository extends JpaRepository<PurchasedCard, Long> {
}
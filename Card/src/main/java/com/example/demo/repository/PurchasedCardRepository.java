package com.example.demo.repository;

import com.example.demo.domain.PurchasedCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchasedCardRepository extends JpaRepository<PurchasedCard, Long> {
}
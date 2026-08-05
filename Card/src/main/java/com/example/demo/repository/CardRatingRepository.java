package com.example.demo.repository;

import com.example.demo.domain.CardRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRatingRepository extends JpaRepository<CardRating, Long> {

    // 카드 식별자별 평균 별점 계산 (등록된 별점이 없을 경우 0.0 반환)
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM CardRating r WHERE r.cardName = :cardName")
    Double findAverageRatingByCardName(@Param("cardName") String cardName);
}
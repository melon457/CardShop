package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter
@NoArgsConstructor
public class CardRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cardName; // 카드 식별자 (예: "jang", "lee", "iu" 등)

    private Double rating;   // 별점 점수 (1~5)

    public CardRating(String cardName, Double rating) {
        this.cardName = cardName;
        this.rating = rating;
    }
}
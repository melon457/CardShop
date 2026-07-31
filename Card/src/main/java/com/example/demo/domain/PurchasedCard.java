package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchasedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cardName; // 카드 이름 (예: park, lee 등)

    @Column(nullable = false)
    private String imgUrl;   // 카드 이미지 경로 (예: image/park.png)

    private LocalDateTime purchasedAt;

    @PrePersist
    public void prePersist() {
        this.purchasedAt = LocalDateTime.now();
    }
}
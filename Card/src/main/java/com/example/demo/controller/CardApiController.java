package com.example.demo.controller;

import com.example.demo.domain.PurchasedCard;
import com.example.demo.repository.PurchasedCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardApiController {

    private final PurchasedCardRepository purchasedCardRepository;

    // 구매한 카드(보관함) 목록 조회
    @GetMapping("/collection")
    public List<PurchasedCard> getMyCollection() {
        return purchasedCardRepository.findAll();
    }

    // 카드 구매 처리
    @PostMapping("/purchase")
    public PurchasedCard purchaseCard(@RequestBody PurchasedCard card) {
        return purchasedCardRepository.save(card);
    }
}
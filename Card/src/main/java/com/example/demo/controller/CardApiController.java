package com.example.demo.controller;

import com.example.demo.domain.PurchasedCard;
import com.example.demo.repository.PurchasedCardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardApiController {

    private final PurchasedCardRepository purchasedCardRepository;

    public CardApiController(PurchasedCardRepository purchasedCardRepository) {
        this.purchasedCardRepository = purchasedCardRepository;
    }

    @PostMapping("/purchase")
    public ResponseEntity<PurchasedCard> purchaseCard(@RequestBody Map<String, String> request) {
        String cardName = request.get("cardName");
        String imgUrl = request.get("imgUrl");

        PurchasedCard card = new PurchasedCard(cardName, imgUrl);
        PurchasedCard savedCard = purchasedCardRepository.save(card);
        return ResponseEntity.ok(savedCard);
    }
    @GetMapping("/purchased")
    public ResponseEntity<List<PurchasedCard>> getPurchasedCards() {
        List<PurchasedCard> cards = purchasedCardRepository.findAll();
        return ResponseEntity.ok(cards);
    }
    @DeleteMapping("/sell/{id}")
    public ResponseEntity<Void> sellCard(@PathVariable Long id) {
        if (purchasedCardRepository.existsById(id)) {
            purchasedCardRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
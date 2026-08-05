package com.example.demo.controller;

import com.example.demo.domain.CardRating;
import com.example.demo.repository.CardRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class CardRatingApiController {

    @Autowired
    private CardRatingRepository cardRatingRepository;

    // 별점 등록 API
    @PostMapping
    public ResponseEntity<?> addRating(@RequestBody Map<String, Object> payload) {
        String cardName = (String) payload.get("cardName");
        Double rating = Double.valueOf(payload.get("rating").toString());

        cardRatingRepository.save(new CardRating(cardName, rating));

        // 저장 후 업데이트된 평균 별점 반환 (소수점 첫째 자리까지 반올림)
        Double avgRating = cardRatingRepository.findAverageRatingByCardName(cardName);
        double roundedAvg = Math.round(avgRating * 10.0) / 10.0;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("cardName", cardName);
        response.put("averageRating", roundedAvg);

        return ResponseEntity.ok(response);
    }

    // 카드별 평균 별점 조회 API
    @GetMapping("/{cardName}/average")
    public ResponseEntity<?> getAverageRating(@PathVariable String cardName) {
        Double avgRating = cardRatingRepository.findAverageRatingByCardName(cardName);
        double roundedAvg = Math.round(avgRating * 10.0) / 10.0;

        Map<String, Object> response = new HashMap<>();
        response.put("cardName", cardName);
        response.put("averageRating", roundedAvg);

        return ResponseEntity.ok(response);
    }
}
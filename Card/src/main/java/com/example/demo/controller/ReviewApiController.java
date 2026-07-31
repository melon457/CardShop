package com.example.demo.controller;

import com.example.demo.domain.Review;
import com.example.demo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewApiController {

    private final ReviewRepository reviewRepository;

    // 상품평 전체 조회
    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // 상품평 작성
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    // 상품평 수정
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review reviewDetails) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 존재하지 않습니다. id=" + id));
        
        review.setBuyerName(reviewDetails.getBuyerName());
        review.setContent(reviewDetails.getContent());
        
        return reviewRepository.save(review);
    }

    // 상품평 삭제
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewRepository.deleteById(id);
    }
}
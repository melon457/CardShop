// --- 1. 모달 3D 포토카드 제어 ---
const cardItems = document.querySelectorAll('.card-item');
const modal = document.getElementById('cardModal');
const backdrop = document.querySelector('.modal__backdrop');
const modalCard = document.querySelector('.modal__card');
const modalCardInner = document.querySelector('.modal__card-inner');
const modalImg = document.getElementById('modalImg');
const glare = document.querySelector('.modal__card-glare');

let isAnimating = false;

if (cardItems.length > 0 && modal) {
  cardItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isAnimating) return;
      isAnimating = true;

      const imgSrc = item.getAttribute('data-img');
      modalImg.src = imgSrc;

      glare.style.opacity = '0';
      modalCardInner.style.transition = 'none';
      modalCardInner.style.transform = 'rotateY(180deg)';

      modal.classList.add('active');

      setTimeout(() => {
        modalCardInner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)';
        modalCardInner.style.transform = 'rotateY(360deg)';
      }, 50);

      setTimeout(() => { isAnimating = false; }, 850);
    });
  });

  modalCard.addEventListener('mousemove', (e) => {
    if (isAnimating) return;

    const rect = modalCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    modalCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    glare.style.backgroundPosition = `${percentX}% ${percentY}%`;
    glare.style.opacity = '1';
  });

  modalCard.addEventListener('mouseleave', () => {
    modalCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    glare.style.opacity = '0';
  });

  backdrop.addEventListener('click', () => {
    if (isAnimating) return;
    modal.classList.remove('active');
    modalCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    glare.style.opacity = '0';
  });
}

// --- 2. 상품평 CRUD 제어 (reviews.html 전용) ---
const reviewForm = document.getElementById('review-form');

if (reviewForm) {
  const buyerNameInput = document.getElementById('buyer-name');
  const reviewContentInput = document.getElementById('review-content');
  const reviewIdInput = document.getElementById('review-id');
  const reviewList = document.getElementById('review-list');
  const submitBtn = document.getElementById('review-submit-btn');

  let reviews = [
    { id: 1, buyerName: "김민지", content: "포토카드 실물이 너무 예쁘네요! 배송도 정말 빨랐습니다." }
  ];

  function renderReviews() {
    reviewList.innerHTML = '';
    reviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-card__info">
          <h4>${review.buyerName}</h4>
          <p>${review.content}</p>
        </div>
        <div class="review-card__actions">
          <button class="action-btn" onclick="editReview(${review.id})">수정</button>
          <button class="action-btn" onclick="deleteReview(${review.id})">삭제</button>
        </div>
      `;
      reviewList.appendChild(card);
    });
  }

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = reviewIdInput.value;
    const buyerName = buyerNameInput.value;
    const content = reviewContentInput.value;

    if (id) {
      const target = reviews.find(r => r.id == id);
      if (target) {
        target.buyerName = buyerName;
        target.content = content;
      }
      submitBtn.textContent = '리뷰 등록';
      reviewIdInput.value = '';
    } else {
      reviews.push({ id: Date.now(), buyerName, content });
    }

    buyerNameInput.value = '';
    reviewContentInput.value = '';
    renderReviews();
  });

  window.editReview = function(id) {
    const target = reviews.find(r => r.id == id);
    if (target) {
      reviewIdInput.value = target.id;
      buyerNameInput.value = target.buyerName;
      reviewContentInput.value = target.content;
      submitBtn.textContent = '리뷰 수정 완료';
    }
  };

  window.deleteReview = function(id) {
    reviews = reviews.filter(r => r.id != id);
    renderReviews();
  };

  renderReviews();
}
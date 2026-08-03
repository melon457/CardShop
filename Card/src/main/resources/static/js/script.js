document.addEventListener('DOMContentLoaded', () => {
  initModal();

  initReviews();

  initCollection();
});

let isAnimating = false;

function initModal() {
  const modal = document.getElementById('cardModal');
  if (!modal) return;

  const backdrop = modal.querySelector('.modal__backdrop');
  const modalCard = modal.querySelector('.modal__card');
  const modalCardInner = modal.querySelector('.modal__card-inner');
  const modalImg = document.getElementById('modalImg');
  const glare = modal.querySelector('.modal__card-glare');

  document.addEventListener('click', (e) => {
    const cardItem = e.target.closest('.card-item');
    if (!cardItem) return;

    if (isAnimating) return;
    isAnimating = true;

    const imgSrc = cardItem.getAttribute('data-img');
    if (modalImg && imgSrc) {
      modalImg.src = imgSrc;
    }

    if (glare) glare.style.opacity = '0';
    if (modalCardInner) {
      modalCardInner.style.transition = 'none';
      modalCardInner.style.transform = 'rotateY(180deg)';
    }

    modal.classList.add('active');

    setTimeout(() => {
      if (modalCardInner) {
        modalCardInner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1)';
        modalCardInner.style.transform = 'rotateY(360deg)';
      }
    }, 50);

    setTimeout(() => { isAnimating = false; }, 850);
  });

  if (modalCard && glare) {
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
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      if (isAnimating) return;
      modal.classList.remove('active');
      if (modalCard) modalCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
      if (glare) glare.style.opacity = '0';
    });
  }
}

function initReviews() {
  const reviewForm = document.getElementById('review-form');
  if (!reviewForm) return;

  const buyerNameInput = document.getElementById('buyer-name');
  const reviewContentInput = document.getElementById('review-content');
  const reviewIdInput = document.getElementById('review-id');
  const reviewList = document.getElementById('review-list');
  const submitBtn = document.getElementById('review-submit-btn');

  function fetchReviews() {
    fetch('/api/reviews')
      .then(res => {
        if (!res.ok) throw new Error('데이터 로드 실패');
        return res.json();
      })
      .then(reviews => renderReviews(reviews))
      .catch(err => console.error('리뷰 불러오기 실패:', err));
  }

  function renderReviews(reviews) {
    if (!reviewList) return;
    reviewList.innerHTML = '';

    if (reviews.length === 0) {
      reviewList.innerHTML = '<p style="color:#71717a; text-align:center;">등록된 상품평이 없습니다.</p>';
      return;
    }

    reviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-card__info">
          <h4>${escapeHtml(review.buyerName)}</h4>
          <p>${escapeHtml(review.content)}</p>
        </div>
        <div class="review-card__actions">
          <button class="action-btn" onclick="editReview(${review.id}, '${escapeQuote(review.buyerName)}', '${escapeQuote(review.content)}')">수정</button>
          <button class="action-btn" onclick="deleteReview(${review.id})">삭제</button>
        </div>
      `;
      reviewList.appendChild(card);
    });
  }

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = reviewIdInput.value;
    const buyerName = buyerNameInput.value.trim();
    const content = reviewContentInput.value.trim();

    if (!buyerName || !content) return;

    if (id) {
      fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerName, content })
      })
      .then(res => res.json())
      .then(() => {
        submitBtn.textContent = '리뷰 등록';
        reviewIdInput.value = '';
        buyerNameInput.value = '';
        reviewContentInput.value = '';
        fetchReviews();
      })
      .catch(err => alert('수정 실패: ' + err.message));
    } else {
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerName, content })
      })
      .then(res => res.json())
      .then(() => {
        buyerNameInput.value = '';
        reviewContentInput.value = '';
        fetchReviews();
      })
      .catch(err => alert('등록 실패: ' + err.message));
    }
  });
  window.editReview = function(id, name, content) {
    reviewIdInput.value = id;
    buyerNameInput.value = name;
    reviewContentInput.value = content;
    submitBtn.textContent = '리뷰 수정 완료';
  };

  window.deleteReview = function(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      .then(() => fetchReviews())
      .catch(err => alert('삭제 실패: ' + err.message));
  };

  fetchReviews();
}

function initCollection() {
  const collectionGallery = document.getElementById('collection-gallery');
  if (collectionGallery) {
    fetchCollectionCards(collectionGallery);
  }
}

function fetchCollectionCards(container) {
  fetch('/api/cards/collection')
    .then(res => res.json())
    .then(cards => {
      if (cards.length === 0) {
        container.innerHTML = '<p style="color:#71717a; text-align:center; width:100%;">보유 중인 카드가 없습니다.</p>';
        return;
      }

      container.innerHTML = '';
      cards.forEach(card => {
        const cardElem = document.createElement('div');
        cardElem.className = 'card-item';
        cardElem.setAttribute('data-img', card.imgUrl);
        cardElem.innerHTML = `
          <div class="card-item__inner">
            <img src="${card.imgUrl}" alt="${card.cardName}">
          </div>
        `;
        container.appendChild(cardElem);
      });
    })
    .catch(err => console.error('보관함 로드 실패:', err));
}

window.buyCard = function(cardName, imgUrl) {
  fetch('/api/cards/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardName: cardName, imgUrl: imgUrl })
  })
  .then(res => {
    if (!res.ok) throw new Error('구매 실패');
    return res.json();
  })
  .then(() => {
    alert(`'${cardName}' 카드를 구매하여 내 보관함에 저장했습니다!`);
  })
  .catch(() => alert('카드 구매 처리 중 오류가 발생했습니다.'));
};

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function escapeQuote(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}
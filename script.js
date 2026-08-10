/* ==========================================================================
   온마루아동가족상담센터 Multi-Page Interactive Script
   ========================================================================== */

// Quiz State
let quizAnswers = { step1: null, step2: null, step3: null };

// Open Reservation Modal
function openReservationModal(programName) {
  const modal = document.getElementById('reserveModal');
  const progSelect = document.getElementById('progSelect');
  
  if (programName && progSelect) {
    for (let i = 0; i < progSelect.options.length; i++) {
      if (progSelect.options[i].value.includes(programName) || programName.includes(progSelect.options[i].value)) {
        progSelect.selectedIndex = i;
        break;
      }
    }
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    location.href = 'location.html';
  }
}

// Close Reservation Modal
function closeReservationModal() {
  const modal = document.getElementById('reserveModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Handle Form Submit
function handleReserveSubmit(e) {
  e.preventDefault();
  closeReservationModal();
  showToast("🌿 상담 예약 문의가 100% 비밀보장으로 접수되었습니다. 담당자가 곧 연락드리겠습니다.");
  
  const form = e.target;
  if (form) form.reset();
}

// Quiz Functions
function selectQuiz(step, value) {
  quizAnswers[`step${step}`] = value;
  
  if (step === 1) {
    document.getElementById('quizStep1')?.classList.add('hidden');
    document.getElementById('quizStep2')?.classList.remove('hidden');
  } else if (step === 2) {
    document.getElementById('quizStep2')?.classList.add('hidden');
    document.getElementById('quizStep3')?.classList.remove('hidden');
  }
}

function finishQuiz(type) {
  quizAnswers.step3 = type;
  document.getElementById('quizStep3')?.classList.add('hidden');
  document.getElementById('quizResult')?.classList.remove('hidden');

  const titleElem = document.getElementById('resultTitle');
  const descElem = document.getElementById('resultDesc');

  if (quizAnswers.step1 === 'child') {
    if (titleElem) titleElem.innerText = '아동·청소년 놀이 & 미술 치료';
    if (descElem) descElem.innerText = '말 표현이 서툰 아이가 놀이와 미술로 마음을 표현하도록 조력하는 아동 전용 치유 프로그램입니다.';
  } else if (quizAnswers.step1 === 'couple') {
    if (titleElem) titleElem.innerText = '부부 & 커플/가족 대화 클리닉';
    if (descElem) descElem.innerText = '반복되는 말다툼과 대화의 단절을 풀고 서로의 진심을 경청할 수 있도록 돕는 감정 중심 가족 솔루션입니다.';
  } else if (quizAnswers.step1 === 'coaching') {
    if (titleElem) titleElem.innerText = '맞춤형 부모 양육 코칭';
    if (descElem) descElem.innerText = '훈육에 어려움을 겪는 부모님을 위해 자녀의 기질에 꼭 맞는 1:1 양육 지침 가이드를 제시해 드립니다.';
  } else {
    if (titleElem) titleElem.innerText = '성인 1:1 개별 심리상담';
    if (descElem) descElem.innerText = '우울, 불안, 양육 스트레스로 지친 내 마음을 100% 비밀보장이 되는 안심 공간에서 치유해 드립니다.';
  }
}

function resetQuiz() {
  quizAnswers = { step1: null, step2: null, step3: null };
  document.getElementById('quizResult')?.classList.add('hidden');
  document.getElementById('quizStep1')?.classList.remove('hidden');
}

function openReservationModalWithProgram() {
  const currentTitle = document.getElementById('resultTitle')?.innerText;
  openReservationModal(currentTitle || '맞춤 상담');
}

// Program Filter by Tab
function filterPrograms(category, btnElement) {
  const cards = document.querySelectorAll('.program-card');
  const buttons = document.querySelectorAll('.tab-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      setTimeout(() => card.style.opacity = '1', 50);
    } else {
      card.style.display = 'none';
    }
  });
}

// Copy Address
function copyAddress() {
  const addressText = "부산시 강서구 명지국제2로 28번길 3 동건프라자 802호 온마루아동가족상담센터";
  navigator.clipboard.writeText(addressText).then(() => {
    showToast("📋 센터 주소가 클립보드에 복사되었습니다!");
  }).catch(() => {
    showToast("주소: " + addressText);
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.toggle('active');
}

// Close Modal on Backdrop Click
document.addEventListener('click', function(e) {
  const modal = document.getElementById('reserveModal');
  if (modal && e.target === modal) {
    closeReservationModal();
  }
});

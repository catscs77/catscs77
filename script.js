/* ==========================================================================
   온마루아동가족상담센터 Multi-Page Interactive Script
   ========================================================================== */

// Quiz State
let quizAnswers = { step1: null, step2: null, step3: null };

// Open Reservation - 카카오톡 오픈채팅으로 바로 연결
function openReservationModal(programName) {
  window.open('https://open.kakao.com/o/sEYOFMIi', '_blank');
}

// Close Reservation Modal
function closeReservationModal() {
  const modal = document.getElementById('reserveModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Handle Form Submit (EmailJS + Contact Modal)
function handleReserveSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    client_name: document.getElementById('clientName')?.value || '',
    client_phone: document.getElementById('clientPhone')?.value || '',
    program: document.getElementById('progSelect')?.value || '',
    message: document.getElementById('clientMsg')?.value || '',
    submit_date: new Date().toLocaleString('ko-KR')
  };

  closeReservationModal();

  // EmailJS로 이메일 알림 전송
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, formData)
      .then(function() {
        console.log('📧 이메일 알림 전송 성공');
      })
      .catch(function(error) {
        console.log('이메일 전송 실패:', error);
      });
  }

  if (form) form.reset();
  
  // Show contact options modal
  showContactModal();
}

// ============================================================
// EmailJS 설정 (아래 값을 본인 계정 정보로 변경하세요)
// EmailJS 가입: https://www.emailjs.com
// ============================================================
const EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',      // EmailJS > Account > Public Key
  serviceId: 'YOUR_SERVICE_ID',      // EmailJS > Email Services > Service ID
  templateId: 'YOUR_TEMPLATE_ID'     // EmailJS > Email Templates > Template ID
};

// EmailJS 초기화
function initEmailJS() {
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS 초기화 완료');
  }
}
document.addEventListener('DOMContentLoaded', initEmailJS);

// Show Contact Options (Phone / KakaoTalk)
function showContactModal() {
  let modal = document.getElementById('contactModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'contactModal';
    modal.innerHTML = `
      <div class="modal-box glass-card" style="max-width: 480px;">
        <button class="modal-close" onclick="closeContactModal()">&times;</button>
        <div class="modal-header" style="text-align: center;">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,#4CAF50,#81C784);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.5rem;color:#fff;">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2 style="margin-bottom:8px;">상담 신청이 접수되었습니다 🌿</h2>
          <p style="color:var(--text-muted);font-size:0.95rem;">아래 방법으로 바로 상담 연결이 가능합니다</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-top:24px;">
          <a href="https://open.kakao.com/o/sEYOFMIi" target="_blank" class="btn btn-block" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;font-size:1.08rem;background:#FEE500;color:#3C1E1E;border:none;border-radius:var(--radius-sm);font-weight:700;cursor:pointer;transition:var(--transition);">
            <i class="fa-solid fa-comment"></i> 카카오톡으로 바로 상담하기
          </a>
          <a href="tel:01071829146" class="btn btn-primary btn-block" style="display:flex;align-items:center;justify-content:center;gap:10px;padding:16px;font-size:1.05rem;">
            <i class="fa-solid fa-phone"></i> 전화 상담 연결 (010-7182-9146)
          </a>
        </div>
        <p style="text-align:center;font-size:0.8rem;color:var(--text-muted);margin-top:20px;">
          <i class="fa-solid fa-lock" style="margin-right:4px;"></i> 모든 상담 내용은 100% 비밀보장됩니다
        </p>
      </div>
    `;
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeContactModal();
    });
    document.body.appendChild(modal);
  }
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
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

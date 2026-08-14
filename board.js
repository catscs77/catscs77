/* ==========================================================================
   온마루 게시판 (Board) JavaScript
   localStorage 기반으로 글 저장/조회/필터링 기능 구현
   ========================================================================== */

// Default sample posts
const DEFAULT_POSTS = [
  {
    id: 1,
    category: 'notice',
    author: '온마루 센터',
    title: '🌿 온마루아동가족상담센터 홈페이지가 새롭게 오픈하였습니다',
    content: '안녕하세요, 온마루아동가족상담센터입니다.\n\n아이와 가족의 마음을 따뜻하게 감싸안는 온마루 홈페이지가 새롭게 단장되었습니다.\n\n홈페이지에서 상담 프로그램 확인, 셀프 마음체크, 간편 예약 문의를 하실 수 있습니다.\n\n언제든 편하게 방문해 주세요. 감사합니다. 🌱',
    date: '2026-08-10',
    views: 24
  },
  {
    id: 2,
    category: 'parenting',
    author: '지후맘',
    title: '5살 아이 분리불안이 심해요... 경험 나눠주실 분 계실까요?',
    content: '어린이집 보낼 때마다 울면서 안 떨어지려고 해요.\n집에서는 괜찮은데 밖에만 나가면 제 손을 꼭 잡고 놓질 않아요.\n\n혹시 비슷한 경험 있으신 분 계시면 어떻게 대처하셨는지 이야기 나눠주시면 감사하겠습니다.',
    date: '2026-08-12',
    views: 18
  },
  {
    id: 3,
    category: 'review',
    author: '민준이엄마',
    title: '놀이치료 3개월 후기 - 정말 달라졌어요',
    content: '아이가 또래 친구들과 어울리기 힘들어하고 자존감이 낮아 걱정이 많았는데,\n온마루에서 놀이치료를 시작한 지 3개월이 지났습니다.\n\n처음에는 선생님한테도 말을 안 하던 아이가 이제는 먼저 인사도 하고,\n어린이집에서도 친구들과 잘 어울린다는 피드백을 받았어요.\n\n무엇보다 저도 부모 양육 코칭을 함께 받으면서 아이를 대하는 방법이 많이 바뀌었습니다.\n노진숙 센터장님 정말 감사합니다. 💚',
    date: '2026-08-13',
    views: 31
  }
];

// Initialize posts from localStorage or use defaults
function getPosts() {
  const stored = localStorage.getItem('onmaru_board_posts');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('onmaru_board_posts', JSON.stringify(DEFAULT_POSTS));
  return DEFAULT_POSTS;
}

function savePosts(posts) {
  localStorage.setItem('onmaru_board_posts', JSON.stringify(posts));
}

// Current filter state
let currentBoardFilter = 'all';

// Category labels
const CATEGORY_LABELS = {
  notice: '📌 공지사항',
  parenting: '👶 양육 이야기',
  review: '💚 상담 후기',
  free: '💬 자유 글'
};

const CATEGORY_CLASSES = {
  notice: 'cat-notice',
  parenting: 'cat-parenting',
  review: 'cat-review',
  free: 'cat-free'
};

// Render board list
function renderBoard() {
  const posts = getPosts();
  const filtered = currentBoardFilter === 'all' 
    ? posts 
    : posts.filter(p => p.category === currentBoardFilter);

  const listEl = document.getElementById('boardList');
  const emptyEl = document.getElementById('boardEmpty');
  const countEl = document.getElementById('boardCount');

  if (!listEl) return;

  if (filtered.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (countEl) countEl.textContent = '총 0개의 글';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (countEl) countEl.textContent = `총 ${filtered.length}개의 글`;

  // Sort by date descending, notices first
  const sorted = [...filtered].sort((a, b) => {
    if (a.category === 'notice' && b.category !== 'notice') return -1;
    if (b.category === 'notice' && a.category !== 'notice') return 1;
    return new Date(b.date) - new Date(a.date);
  });

  listEl.innerHTML = sorted.map(post => `
    <div class="board-item ${post.category === 'notice' ? 'board-notice' : ''}" onclick="openPostDetail(${post.id})">
      <div class="board-item-left">
        <span class="board-cat ${CATEGORY_CLASSES[post.category]}">${CATEGORY_LABELS[post.category]}</span>
        <h3 class="board-title">${escapeHtml(post.title)}</h3>
        <div class="board-meta">
          <span><i class="fa-regular fa-user"></i> ${escapeHtml(post.author)}</span>
          <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
          <span><i class="fa-regular fa-eye"></i> ${post.views}</span>
        </div>
      </div>
      <div class="board-item-right">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  `).join('');
}

// Filter board
function filterBoard(category, btnEl) {
  currentBoardFilter = category;
  
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  
  renderBoard();
}

// Open write modal
function openWriteModal() {
  const modal = document.getElementById('writeModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeWriteModal() {
  const modal = document.getElementById('writeModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Handle write form submit
function handleWriteSubmit(e) {
  e.preventDefault();
  
  const posts = getPosts();
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  const newPost = {
    id: newId,
    category: document.getElementById('postCategory').value,
    author: document.getElementById('postAuthor').value,
    title: document.getElementById('postTitle').value,
    content: document.getElementById('postContent').value,
    date: dateStr,
    views: 0
  };

  posts.push(newPost);
  savePosts(posts);
  
  closeWriteModal();
  document.getElementById('writeForm').reset();
  renderBoard();
  
  if (typeof showToast === 'function') {
    showToast('🌿 글이 성공적으로 등록되었습니다!');
  }
}

// Open post detail
function openPostDetail(postId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  // Increment views
  post.views++;
  savePosts(posts);
  renderBoard();

  const contentEl = document.getElementById('postDetailContent');
  if (contentEl) {
    contentEl.innerHTML = `
      <div class="post-detail">
        <span class="board-cat ${CATEGORY_CLASSES[post.category]}">${CATEGORY_LABELS[post.category]}</span>
        <h2 class="post-detail-title">${escapeHtml(post.title)}</h2>
        <div class="post-detail-meta">
          <span><i class="fa-regular fa-user"></i> ${escapeHtml(post.author)}</span>
          <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
          <span><i class="fa-regular fa-eye"></i> 조회 ${post.views}</span>
        </div>
        <hr style="border: none; border-top: 1px solid var(--border-color); margin: 20px 0;">
        <div class="post-detail-body">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
        <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-outline" onclick="closePostDetail()"><i class="fa-solid fa-arrow-left"></i> 목록으로</button>
          <button class="btn btn-primary" onclick="closePostDetail(); openReservationModal()"><i class="fa-regular fa-calendar-check"></i> 상담 예약하기</button>
        </div>
      </div>
    `;
  }

  const modal = document.getElementById('postDetailModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closePostDetail() {
  const modal = document.getElementById('postDetailModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Escape HTML helper
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Close modals on backdrop click
document.addEventListener('click', function(e) {
  if (e.target.id === 'writeModal') closeWriteModal();
  if (e.target.id === 'postDetailModal') closePostDetail();
});

// Initialize board on page load
document.addEventListener('DOMContentLoaded', renderBoard);

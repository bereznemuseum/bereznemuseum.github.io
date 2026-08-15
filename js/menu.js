/**
 * menu.js
 * ─────────────────────────────────────────────────────────────────────────
 * Логіка сторінки "Меню об'єктів" (index.html).
 * Будує адаптивну сітку карток на основі LANDMARKS_DATA (data.js) —
 * тобто додавання нової пам'ятки в data.js автоматично додає картку сюди,
 * без жодних ручних правок цієї сторінки.
 * ─────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  renderLandmarkGrid();
});

// Підготовка тексту для опису для картки: 
// - очистити від маркерів форматування ("*", "**", "\n"), 
// - обрізати до 200 символів 
// - додати "..." у кінці, якщо текст не вмістився.
function prepareDescription(description) {
  return description
    .replace(/[*_~`]/g, '') // видаляємо маркери форматування
    .replace(/\n/g, ' ') // замінюємо перенос рядка на пробіл
    .trim() // видаляємо зайві пробіли на початку та в кінці
    .slice(0, 200) + (description.length > 200 ? '...' : ''); // обрізаємо до 200 символів і додаємо "..." якщо текст не вмістився
}

function renderLandmarkGrid() {
  const grid = document.getElementById('landmarkGrid');
  if (!grid) return;

  // Якщо даних про об'єкти немає, показуємо "порожній стан" із зображенням і текстом
  if (!LANDMARKS_DATA.length) {
    grid.outerHTML = 
      '<div class="empty-state-container">' +
      '<img class="empty-state-image" src="assets/images/placeholders/red-tower-question-mark-compressed.webp" alt="Порожній стан">' +
      '<h2 class="empty-state-title">Об\'єкти ще не додані</h2>' +
      '<p class="empty-state-subtitle">Перевірте посилання або спробуйте пізніше.</p>' +
      '</div>';
    return;
  }

  // Будуємо HTML-код карток на основі даних LANDMARKS_DATA і вставляємо його в DOM
  grid.innerHTML = LANDMARKS_DATA.map((landmark) => `
    <a class="landmark-card appear" href="landmark.html?id=${encodeURIComponent(landmark.id)}">
      <img
        class="landmark-card__image"
        src="${getLandmarkCoverImage(landmark)}"
        onerror="this.onerror=null; this.src='assets/images/placeholders/image-placeholder.svg';"
        alt="${landmark.name}"
        loading="lazy"
      >
      <p class="landmark-card__name">${landmark.name}</p>
      
      <p class="landmark-card__description">${prepareDescription(landmark.description)}</p>
    </a>
  `).join('');

  // Картки додані вже ПІСЛЯ ініціалізації appear-обсервера в common.js
  // (обидва скрипти чекають DOMContentLoaded, а порядок підключення
  // визначає порядок виконання) — тому запускаємо спостереження за
  // щойно створеними .appear-елементами повторно.
  initAppearOnScrollAnimations();
}

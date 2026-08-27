/**
 * landmark.js
 * ─────────────────────────────────────────────────────────────────────────
 * Логіка сторінки ОДНІЄЇ пам'ятки (landmark.html).
 * Читає ?id= з адресного рядка, бере відповідний запис із LANDMARKS_DATA
 * (data.js) і наповнює контентом статичну розмітку.
 *
 * Підключення на сторінці (порядок важливий):
 *   1. data.js
 *   2. common.js
 *   3. landmark.js  (цей файл)
 * ─────────────────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  const landmark = resolveCurrentLandmark();
  if (!landmark) return; // resolveCurrentLandmark() вже показав порожній стан

  populateMeta(landmark);
  populateHero(landmark);
  populateInfo(landmark);
  populateGalleries(landmark);
  populateLocationLinks(landmark);
  setupLightbox();
  setupActiveNavHighlighting();
});

/**
 * Знаходить пам'ятку за параметром ?id= в URL.
 * Якщо параметр відсутній або не знайдений — показує порожній стан.
 */
function resolveCurrentLandmark() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const landmark = LANDMARKS_DATA.find((item) => item.id === id);

  if (!landmark) {
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML =
        '<section class="container" style="margin-top: calc(var(--header-height) + var(--space-6));">' +
        '<div class="empty-state-container">' +
        '<img class="empty-state-image" src="assets/images/placeholders/red-tower-question-mark-compressed.webp" alt="Порожній стан">' +
        '<h2 class="empty-state-title">Сторінку не знайдено</h2>' +
        '<p class="empty-state-subtitle">Перевірте посилання або спробуйте пізніше.</p>' +
        '<a href="index.html" class="empty-state-link">Повернутися до меню</a>' +
        '</div>' +
        '</section>';
    }
    populateMeta({ name: 'Сторінку не знайдено' });
  }

  return landmark;
}

/** Заголовок вкладки браузера + alt-текст сторінки для доступності/SEO */
function populateMeta(landmark) {
  document.title = `${landmark.name} \u2014 Пам\u2019ятки міста Березне`;
}

/**
 * Наповнює акцентну секцію: <model-viewer>, AR-кнопку, підпис.
 *
 * ---------------------------------------------------------------------
 * ДОВІДКА ПО КЛЮЧОВИХ АТРИБУТАХ <model-viewer>:
 *
 *   camera-orbit="AZIMUTHдеg POLARдеg RADIUSm"
 *     - AZIMUTH: горизонтальний кут навколо моделі (0deg = "спереду")
 *     - POLAR:   кут висоти камери. 0deg = точно зверху, 90deg = рівень
 *                горизонту.
 *     - RADIUS:  відстань камери від центру моделі в метрах.
 *
 *   camera-target="X Y Zm"
 *     - точка, навколо якої обертається камера. Оскільки наша модель ~0.5м
 *       заввишки, ставимо Y ≈ половина висоти (0.25m), щоб обертання
 *       відбувалося навколо "центру мас" об'єкта, а не його підніжжя.
 *
 *   min-camera-orbit / max-camera-orbit
 *     - обмежують діапазон, у якому відвідувач може крутити камеру.
 *     - формат той самий: "AZIMUTH POLAR RADIUS".
 *     - "auto" лишає значення без змін відносно default camera-orbit.
 *     - Налаштування нижче: не дозволяємо дивитись знизу (min POLAR = 35deg —
 *       не можна "лягти на підлогу") і зверху занадто прямовисно
 *       (max POLAR = 100deg — трохи нижче горизонту, але не "з-під землі"),
 *       а також не дозволяємо підʼїхати впритул чи відʼїхати задалеко
 *       (min/max RADIUS).
 * ---------------------------------------------------------------------
 */
function populateHero(landmark) {
  const modelViewer = document.getElementById('landmarkModel');
  const modelStage = document.getElementById('modelStage');
  const arButton = document.getElementById('arTriggerButton');

  if (!modelViewer) return;

  // ---- Джерела моделі ----
  modelViewer.setAttribute('src', landmark.model.src || 'assets/models/placeholders/model-placeholder.glb');
  if (landmark.model.iosSrc) modelViewer.setAttribute('ios-src', landmark.model.iosSrc);
  modelViewer.setAttribute('alt', landmark.model.alt || landmark.name);
  if (landmark.model.poster) modelViewer.setAttribute('poster', landmark.model.poster);

  // ---- Камера: початкова позиція та межі обертання/зуму (див. довідку вище) ----
  modelViewer.setAttribute('camera-target', '0m 0.25m 0m');
  modelViewer.setAttribute('camera-orbit', '33deg 78deg 2m');
  modelViewer.setAttribute('min-camera-orbit', 'auto 35deg 2m');
  modelViewer.setAttribute('max-camera-orbit', 'auto 95deg 2m');
  modelViewer.setAttribute('field-of-view', '32deg');

  // ---- Автоматичне обертання моделі (slow spin) ----
  // Працює тільки на десктопі, де користувач не чіпає модель пальцем.
  // На мобільних пристроях обертання відключене, щоб не заважати вертикальному скролу.
  modelViewer.setAttribute('auto-rotate', '');
  modelViewer.setAttribute('rotation-per-second', '0.05'); // повний оберт за 20 секунд

  // ---- Оточення: простий колірний фон (за замовчуванням) ----
  // Нейтральне легке студійне освітлення — модель добре читається на
  // будь-якому кольорі фону, без різких відблисків.
  modelViewer.setAttribute('shadow-intensity', '1.5');
  modelViewer.setAttribute('shadow-softness', '0.8');
  modelViewer.setAttribute('exposure', '1');
  modelViewer.setAttribute('environment-image', 'neutral');

  // ---- Skybox-оточення (вимкнено за замовчуванням) ----
  // Якщо захочете підмінити фон на панорамне HDRI-зображення (наприклад,
  // фото неба чи інтер'єру музею) — розкоментуйте рядок нижче і вкажіть
  // свій .hdr/.jpg файл. skybox-image одночасно замінює і освітлення,
  // і візуальний фон навколо моделі.
  //
  // modelViewer.setAttribute('skybox-image', 'assets/environments/name.hdr');

  // ---- Взаємодія ----
  modelViewer.setAttribute('camera-controls', '');
  modelViewer.setAttribute('touch-action', 'pan-y'); // вертикальний скрол сторінки пальцем лишається доступним
  modelViewer.setAttribute('interaction-prompt', 'when-focused'); // не дратує підказкою одразу при завантаженні

  // ---- AR ----
  modelViewer.setAttribute('ar', '');
  modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
  modelViewer.setAttribute('ar-placement', 'floor');

  // ---- Кастомний скелетон замість стандартного індикатора завантаження ----
  // Ховаємо model-viewer (opacity:0 з CSS) і показуємо .model-skeleton,
  // доки не спрацює подія 'load' — вона означає, що модель повністю
  // завантажена й готова до показу.
  modelViewer.addEventListener('load', () => {
    modelStage.classList.add('model-ready');
    updateArButtonAvailability();
  });

 // ---- Кастомна AR-кнопка (розміщена ЗА МЕЖАМИ model-viewer) ----
  // Замість вбудованої кнопки model-viewer використовуємо власну — це дає
  // повну свободу в оформленні й розташуванні. Викликаємо активацію AR
  // програмно через метод activateAR().
  if (arButton) {
    arButton.addEventListener('click', () => {
      modelViewer.activateAR();
    });
  }

  function updateArButtonAvailability() {
    if (!arButton) return;

    // canActivateAR має бути доступним тільки після повного завантаження
    // моделі й готовності платформи.
    const supportsAr = modelViewer.canActivateAR === true;

    if (supportsAr) {
      arButton.hidden = false;
      arButton.style.display = ''; // Скидає inline-стиль, щоб працював клас з CSS
      arButton.removeAttribute('inert'); // Робить кнопку доступною для взаємодії
    } else {
      arButton.hidden = true;
      arButton.style.display = 'none'; // Ховає кнопку, перебиваючи зовнішні CSS-класи
      arButton.setAttribute('inert', ''); // Вирішує проблему з фокусом, повністю вимикаючи елемент для скрінрідерів
    }
  }
}

/** Наповнює секцію "Загальні відомості": назва, опис, бейджі */
function populateInfo(landmark) {
  setText('#landmarkName', landmark.name, { hideWhenEmpty: true });
  setText('#landmarkDescription', landmark.description, {
    hideWhenEmpty: true,
    richText: true,
    preserveParagraphs: true,
  });
  setText('#badgeTypeText', landmark.type, {
    hideWhenEmpty: true,
    hideTargetSelector: '#badgeType',
  });
  setText('#badgeBuiltText', landmark.yearsBuilt ? `Побудовано: ${landmark.yearsBuilt}` : null, {
    hideWhenEmpty: true,
    hideTargetSelector: '#badgeBuilt',
  });
  setText('#badgeDestroyedText', landmark.yearsDestroyed ? `Зруйновано: ${landmark.yearsDestroyed}` : null, {
    hideWhenEmpty: true,
    hideTargetSelector: '#badgeDestroyed',
  });
}

/** Будує вміст трьох галерей на основі масивів фото з data.js */
function populateGalleries(landmark) {
  const galleryConfigs = [
    { sectionId: 'section-gallery-now', containerId: 'galleryNow', photos: landmark.galleryNow },
    { sectionId: 'section-gallery-reconstruction', containerId: 'galleryReconstruction', photos: landmark.galleryReconstruction },
    { sectionId: 'section-gallery-archive', containerId: 'galleryArchive', photos: landmark.galleryArchive },
  ];

  galleryConfigs.forEach(({ sectionId, containerId, photos }) => {
    const section = document.getElementById(sectionId);
    const track = document.getElementById(containerId);
    if (!track) return;

    const hasPhotos = Array.isArray(photos) && photos.some((photo) => photo?.src && String(photo.src).trim());

    if (!hasPhotos) {
      section?.classList.add('is-hidden');
      track.innerHTML = '';
      return;
    }

    section?.classList.remove('is-hidden');
    renderGallery(containerId, photos);
  });
}

/**
 * Рендерить одну галерею у контейнер із заданим id та вмикає для неї
 * горизонтальний безкінечний скрол (опційно) — див. initInfiniteGalleryScroll().
 */
function renderGallery(containerId, photos) {
  const track = document.getElementById(containerId);
  if (!track || !photos || !photos.length) return;

  const buildItems = () =>
    photos
      .map(
        (photo) => `
        <figure class="gallery__item" data-full="${photo.src}" data-caption="${photo.credit || ''}">
          <img src="${photo.src}" onerror="this.onerror=null; this.src='assets/images/placeholders/image-placeholder.svg';" alt="${photo.credit || ''}" loading="lazy">
          ${photo.credit ? `<figcaption class="photo-credit">${photo.credit}</figcaption>` : ''}
        </figure>`
      )
      .join('');

  // Чи вмикати безкінечний скрол — контролюється атрибутом data-loop
  // на самому елементі-треку в HTML (data-loop="true"/"false").
  const loopEnabled = track.dataset.loop === 'true';
  const autoplayEnabled = track.dataset.autoplay === 'true';

  if (loopEnabled) {
    // Клонує набір фото тричі (до + оригінал + після), щоб під час
    // скролу в будь-який бік завжди було що показати — це і створює
    // ілюзію нескінченної стрічки.
    track.innerHTML = buildItems() + buildItems() + buildItems();
    initInfiniteGalleryScroll(track, photos.length, autoplayEnabled);
  } else {
    track.innerHTML = buildItems();
  }
}

/**
 * Безкінечний горизонтальний скрол галереї.
 *
 * Принцип: у треку лежать 3 однакові копії набору фото підряд.
 * Стартуємо з середньої копії. Коли користувач доскролює до країв
 * (першої чи третьої копії), ми МИТТЄВО (без анімації) перестрибуємо
 * scrollLeft на еквівалентну позицію в сусідній копії — глядач цього
 * не помічає, бо кадр виглядає ідентично.
 *
 * @param {HTMLElement} track
 * @param {number} setLength      кількість фото в ОДНІЙ (не потроєній) копії
 * @param {boolean} autoplay      чи вмикати повільний авто-скрол
 */
function initInfiniteGalleryScroll(track, setLength, autoplay) {
  // Чекаємо кадр рендеру, щоб браузер встиг порахувати scrollWidth
  requestAnimationFrame(() => {
    const singleSetWidth = track.scrollWidth / 3;
    track.scrollLeft = singleSetWidth; // стартуємо з середньої копії

    let isUserInteracting = false;
    let resumeTimeout = null;

    track.addEventListener(
      'scroll',
      () => {
        // Якщо доскролили до першої копії — перестрибуємо на середню
        if (track.scrollLeft < singleSetWidth * 0.15) {
          track.scrollLeft += singleSetWidth;
        }
        // Якщо доскролили до третьої копії — перестрибуємо назад на середню
        else if (track.scrollLeft > singleSetWidth * 1.85) {
          track.scrollLeft -= singleSetWidth;
        }
      },
      { passive: true }
    );

    if (!autoplay) return;
    // Не запускаємо авто-прокрутку, якщо користувач просив менше руху
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const PIXELS_PER_FRAME = 0.35; // швидкість авто-скролу, можна змінити

    track.addEventListener('pointerdown', () => { isUserInteracting = true; clearTimeout(resumeTimeout); });
    track.addEventListener('pointerup', () => {
      // Відновлюємо автоскрол через паузу після того, як людина відпустила палець
      resumeTimeout = setTimeout(() => { isUserInteracting = false; }, 2500);
    });

    function autoScrollStep() {
      if (!isUserInteracting) {
        track.scrollLeft += PIXELS_PER_FRAME;
      }
      requestAnimationFrame(autoScrollStep);
    }
    requestAnimationFrame(autoScrollStep);
  });
}

/** Лайтбокс: повноекранний перегляд фото по кліку, закриття по хресту/фону/Esc */
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox) return;

  // Делегування подій: один слухач на весь документ замість слухача на
  // кожному фото окремо — так лайтбокс працює навіть для фото, доданих
  // динамічно (наприклад, при потроєнні для безкінечної галереї).
  document.addEventListener('click', (event) => {
    const item = event.target.closest('.gallery__item');
    if (!item) return;

    lightboxImg.src = item.dataset.full || 'assets/images/placeholders/image-placeholder.svg';
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('is-active');
  });

  function closeLightbox() {
    lightbox.classList.remove('is-active');
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox(); // клік саме по темному фону
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
}

/** Проставляє посилання на карти (Google/Apple) для кнопки "Локація" в нижній навігації */
function populateLocationLinks(landmark) {
  const locationLink = document.getElementById('navLocationLink');
  if (!locationLink || !landmark.location) return;

  const { lat, lng, label } = landmark.location;
  locationLink.href = getMapUrl(lat, lng, label); // getMapUrl визначений у common.js
}

/**
 * Підсвічує активний пункт нижньої навігації відповідно до секції,
 * яка зараз у полі зору користувача.
 */
function setupActiveNavHighlighting() {
  const navLinks = document.querySelectorAll('.mobile-bottom-nav__item[data-target]');
  if (!navLinks.length || !('IntersectionObserver' in window)) return;

  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute('data-target')))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('data-target') === id);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px' } // "активною" вважаємо секцію в середній третині екрана
  );

  sections.forEach((section) => observer.observe(section));
}

/** Утиліта: безпечно проставити текст або форматований вміст, якщо елемент існує */
function setText(selector, value, options = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Опції за замовчуванням
  const {
    hideWhenEmpty = false,
    hideTargetSelector = null,
    richText = false,
    preserveParagraphs = false,
  } = options;

  // Якщо hideTargetSelector заданий, то ховаємо/показуємо не сам елемент,
  // а елемент, який він вказує (наприклад, бейдж із текстом всередині).
  const target = hideTargetSelector ? document.querySelector(hideTargetSelector) || el : el;
  const hasValue = value !== null && value !== undefined && String(value).trim() !== '';

  // Якщо значення порожнє, ховаємо елемент (якщо hideWhenEmpty) і очищуємо його вміст
  if (!hasValue) {
    if (hideWhenEmpty) {
      target.hidden = true;
      target.style.display = 'none';
    } else {
      target.hidden = false;
      target.style.display = '';
    }

    el.innerHTML = '';
    return;
  }

  // Якщо значення є, показуємо елемент і проставляємо текст/HTML
  target.hidden = false;
  target.style.display = '';

  // Якщо preserveParagraphs = true, то розбиваємо текст на абзаци за подвійними переносами рядка
  // і обгортаємо кожен абзац у <p>. Якщо richText = true, то також обробляємо **жирний** та *курсив*.
  if (richText || preserveParagraphs) {
    el.innerHTML = buildFormattedContent(value, preserveParagraphs);
  } else {
    el.textContent = value;
  }
}

// Утиліта для побудови форматованого вмісту
function buildFormattedContent(value, preserveParagraphs = false) {
  const normalized = String(value).replace(/\r\n/g, '\n').trim();
  if (!normalized) return '';

  // Якщо preserveParagraphs = false, то просто обробляємо **жирний** та *курсив* у всьому тексті
  if (!preserveParagraphs) {
    return renderInlineFormatting(normalized);
  }

  // Якщо preserveParagraphs = true, то розбиваємо текст на абзаци за подвійними переносами рядка
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return '';

  return paragraphs.map((paragraph) => `<p>${renderInlineFormatting(paragraph)}</p>`).join('');
}

// Утиліта для обробки **жирного** та *курсиву* у тексті
function renderInlineFormatting(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      parts.push(escapeHtml(text.slice(lastIndex, matchIndex)));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(`<strong>${escapeHtml(token.slice(2, -2))}</strong>`);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(`<em>${escapeHtml(token.slice(1, -1))}</em>`);
    }

    lastIndex = matchIndex + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.slice(lastIndex)));
  }

  return parts.join('');
}

// Утиліта для безпечного екранування HTML-символів
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

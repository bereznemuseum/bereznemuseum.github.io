/**
 * common.js
 * ─────────────────────────────────────────────────────────────────────────
 * Логіка, спільна для ВСІХ сторінок застосунку:
 *   1. Приховування хедера й нижньої навігації при скролі вниз.
 *   2. Fade-in анімація елементів з класом .appear при появі у в'юпорті.
 *   3. Побудова "розумного" посилання на карти (Google/Apple) за координатами.
 *   4. Заповнення року авторських прав.
 *
 * Підключати цей файл ПЕРШИМ (до menu.js / landmark.js) на кожній сторінці.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Універсальна функція приховування елемента при скролі вниз.
 * Використовується і для хедера, і для нижньої навігації — тому винесена
 * в один параметризований метод.
 *
 * @param {HTMLElement} el         елемент, який ховаємо/показуємо
 * @param {string} hiddenClass     клас, що додається при скролі вниз
 * @param {number} threshold       мінімальна дельта скролу (px) для реакції —
 *                                 захищає від зайвих спрацювань на тремтливому скролі
 * @param {number} topOffset       поки не проскролили це значення (px) —
 *                                 елемент завжди залишається видимим
 */
function setupScrollHideBehavior(el, hiddenClass, threshold = 4, topOffset = 60) {
  if (!el) return;

  let lastScrollY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Скролимо вниз і вже проминули верхню "мертву зону" — ховаємо
      if (currentScrollY > lastScrollY && currentScrollY > topOffset && Math.abs(delta) > threshold) {
        el.classList.add(hiddenClass);
      }
      // Скролимо вгору (або взагалі біля самого верху) — показуємо
      else if (currentScrollY < lastScrollY && (Math.abs(delta) > threshold || currentScrollY < topOffset)) {
        el.classList.remove(hiddenClass);
      }

      lastScrollY = currentScrollY;
    },
    { passive: true } // passive прибирає можливість preventDefault і пришвидшує скрол
  );
}

/**
 * Ініціює приховування хедера та нижньої мобільної навігації одним викликом.
 * Викликається один раз при завантаженні кожної сторінки.
 */
function initScrollBehaviors() {
  const header = document.querySelector('.site-header');
  const bottomNav = document.getElementById('mobile-bottom-nav');

  setupScrollHideBehavior(header, 'scroll-hidden');
  setupScrollHideBehavior(bottomNav, 'scroll-down');
}

/**
 * Fade-in при скролі: усі елементи з класом .appear отримують клас .inview,
 * щойно хоча б 10% елемента потрапляє у видиму область екрана.
 * Анімація запускається лише один раз (observer.unobserve) — це економить
 * ресурси й не "переграє" ефект при скролі туди-сюди.
 */
function initAppearOnScrollAnimations() {
  const appearElements = document.querySelectorAll('.appear');
  if (!appearElements.length) return;

  // Якщо у браузера немає підтримки — просто показує все
  if (!('IntersectionObserver' in window)) {
    appearElements.forEach((el) => el.classList.add('inview'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('inview');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 0.1 }
  );

  appearElements.forEach((el) => observer.observe(el));
}

/**
 * Формує посилання на застосунок карт залежно від пристрою користувача:
 * iOS → Apple Maps, усі інші → Google Maps.
 *
 * Примітка: надійного "універсального" URI-схематизатора, що однаково
 * відкриває нативний застосунок карт на будь-якій платформі, у вебі не
 * існує — тому й використовується визначення пристрою через User-Agent.
 * Це найпоширеніший робочий підхід для музейних/туристичних вебзастосунків.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {string} label  назва точки (з'явиться підписом на мапі)
 */
function getMapUrl(lat, lng, label = '') {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    console.error('getMapUrl: lat і lng повинні бути числами');
    return '';
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    // сучасні iPad у "десктопному" режимі видають себе за Mac, тому додатково
    // перевіряє наявність сенсорного вводу
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    return `https://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function populateCopyrightYear() {
  const yearEl = document.getElementById('copyright-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Запускаємо спільну поведінку одразу після побудови DOM
document.addEventListener('DOMContentLoaded', () => {
  initScrollBehaviors();
  initAppearOnScrollAnimations();
  populateCopyrightYear();
});

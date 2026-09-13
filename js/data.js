/**
 * data.js
 * ─────────────────────────────────────────────────────────────────────────
 * ЄДИНЕ ДЖЕРЕЛО КОНТЕНТУ для всього застосунку.
 *
 * Архітектурне рішення: замість того, щоб копіювати
 * landmark.html під кожну пам'ятку, ми маємо ОДИН шаблон сторінки
 * (landmark.html) і ОДИН запис у масиві нижче на кожен об'єкт.
 * QR-код для конкретної пам'ятки веде на адресу виду:
 *
 *     landmark.html?id=vezha-list
 *
 * landmark.js читає параметр `id` з адреси, знаходить відповідний запис
 * у LANDMARKS_DATA і наповнює контентом статичну розмітку.
 *
 * Додати нову пам'ятку = додати новий об'єкт у масив нижче
 * + покласти файли моделі/фото у папку assets. Жодного дублювання HTML.
 * ─────────────────────────────────────────────────────────────────────────
 */

const LANDMARKS_DATA = [
  /*
  // ПРИКЛАД ДАНИХ — видаліть або закоментуйте цей об'єкт, коли додасте реальні пам'ятки
  {
    // ---- Технічний ідентифікатор: лише латиниця, цифри, дефіс. Використовується в URL. ----
    id: 'example-landmark',  // ПРИКЛАД ДАНИХ — замініть на реальний id (латиниця, цифри, дефіс)

    // ---- Загальні відомості (секція 2) ----
    name: 'Приклад пам\'ятки',            // ПРИКЛАД ДАНИХ — замініть на реальну назву
    type: 'Приклад',                               // короткий бейдж виду об'єкту
    description:
      'Приклад опису пам\u2019ятки. Тут буде розповідь про історію споруди, ' +
      'її архітектурні особливості та обставини, за яких вона була втрачена. ' +
      'Замініть цей текст на матеріал.',
    yearsBuilt: '1420\u20131460',                 // роки побудови -> синій бейдж
    yearsDestroyed: '1944',                       // роки знищення -> червоний бейдж

    // ---- Геолокація стенду з QR-кодом / місця, де стояла споруда ----
    location: {
      lat: 50.6199,
      lng: 26.2516,
      label: 'Приклад \u2014 місце розташування',
    },

    // ---- 3D-модель (акцентна секція) ----
    model: {
      // Формат для веб-перегляду і для AR на Android (glTF/GLB).
      // Для AR на iOS (Quick Look) знадобиться ще й .usdz-версія моделі —
      // додайте поле iosSrc: 'assets/models/vezha-list.usdz', щойно вона
      // з'явиться (наприклад, експортована з Reality Converter або Blender).
      // Без iosSrc кнопка AR на iPhone/iPad просто не спрацює.
      src: 'assets/models/placeholders/model-placeholder.glb',
      iosSrc: 'assets/models/placeholders/model-placeholder.usdz',
      alt: 'Цифрова 3D-реконструкція (приклад)'
    },

    // ---- Три галереї (наслідують один компонент galleries) ----
    galleryNow: [
      { src: '', credit: 'Фото: музей, 2025' },
      { src: '', credit: 'Стенд з QR-кодом на місці' },
      { src: '' },
    ],
    galleryReconstruction: [
      { src: '', credit: '3D-реконструкція, 2026' },
      { src: '' },
    ],
    galleryArchive: [
      { src: '', credit: 'Архів музею, бл. 1910' },
      { src: '', credit: 'Приватна колекція' },
      { src: '' },
    ],
  },
  */

  // Костел Святого Каетана
  {
    id: 'kostel-sviatoho-kaetana',
    name: 'Костел Святого Каетана',
    type: 'Костел',
    description:
      'Костел Святого Каетана в Березному (Рівненська область) — цегляний римо-католицький храм, зведений у 1813–1817 роках. ' +
      'Будівництво розпочалося у 1813 році на кошти меценатів Михайла та Анни Корженівських. Освячення (консекрація) відбулося у 1826 році.',
    yearsBuilt: '1813 \u2013 1817',
    yearsDestroyed: '1963',
    location: {
      lat: 51.003555,
      lng: 26.757843,
      label: 'Костел Святого Каетана \u2014 місце розташування',
    },
    model: {
      src: 'assets/models/kostel-sviatoho-kaetana/model-draco.glb',
      iosSrc: 'assets/models/kostel-sviatoho-kaetana/model-ios.usdz',
      alt: 'Цифрова 3D-реконструкція костелу Святого Каетана',
      poster: 'assets/images/data/kostel-sviatoho-kaetana/kostel-sviatoho-kaetana-digital-reconstruction-poster.webp',
    },
    galleryNow: [
      { src: '/', credit: 'Стенд з QR-кодом на місці' },
      { src: '/', credit: 'Фото локації' },
    ],
    galleryReconstruction: [
      { src: 'assets/images/data/kostel-sviatoho-kaetana/reconstruction/kostel-sviatoho-kaetana-digital-reconstruction-isometric.webp', credit: 'Цифрова реконструкція, 2026' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/reconstruction/kostel-sviatoho-kaetana-digital-reconstruction-front.webp', credit: 'Цифрова реконструкція (спереду), 2026' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/reconstruction/kostel-sviatoho-kaetana-digital-reconstruction-side.webp', credit: 'Цифрова реконструкція (збоку), 2026' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/reconstruction/kostel-sviatoho-kaetana-digital-reconstruction-back.webp', credit: 'Цифрова реконструкція (ззаду), 2026' },
    ],
    galleryArchive: [
      { src: 'assets/images/data/kostel-sviatoho-kaetana/archive/kostel-sviatoho-kaetana-archive1.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/archive/kostel-sviatoho-kaetana-archive2.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/archive/kostel-sviatoho-kaetana-archive3.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/kostel-sviatoho-kaetana/archive/kostel-sviatoho-kaetana-archive4.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
    ],
  },

  // Головна єврейська синагога
  {
    id: 'holovna-yevreiska-synahoha',
    name: 'Головна єврейська синагога',
    type: 'Синагога',
    description:
      '**Головна іудейська святиня** була збудована в **1910 році**. ' +
      'Велика синагога вивищувалась над іншими будівлями на розі вулиць Шкільної та Корецької з зіркою та місяцем посередині.\n\n' +
      'Будівля мала прямокутну форму 9х12 м і була збудована у консервативних традиціях культового єврейського зодчества. ' +
      'Біля східної стіни стояв “емуд” (“emud”), де рабин Іцик, син Йозеля молився у “Jamim Noraim” (“Straszne Dni”) ліворуч Ковчега, де знаходилися сувої Тори із срібними коронами і золотими дзвіночками, прикрашені червоним гранатом. ' +
      'Біля входу стояв ящик для свічок, а праворуч вгорі була жіноча галерея. ' +
      'У Великій синагозі молилися в основному хасиди рабина Шмуеля (Szmuelke) та більшість євреїв Березного на великі свята, такі як “Rosz haSzana” i “Jom Kipur”.\n\n' +
      'У Великій синагозі були також окремі невеликі молитовні зали для столярів, кравців і шевців. ' +
      'У них молилися в будні дні (у великому залі проходили Суботні Богослужіння).',
    yearsBuilt: '1910',
    yearsDestroyed: '',
    location: {
      lat: 51.002505,
      lng: 26.755856,
      label: 'Головна єврейська синагога \u2014 місце розташування',
    },
    model: {
      src: 'assets/models/holovna-yevreiska-synahoha/model-draco.glb',
      iosSrc: 'assets/models/holovna-yevreiska-synahoha/model-ios.usdz',
      alt: 'Цифрова 3D-реконструкція головної єврейської синагоги',
      poster: 'assets/images/data/holovna-yevreiska-synahoha/holovna-yevreiska-synahoha-digital-reconstruction-poster.webp',
    },
    galleryNow: [
      { src: '/', credit: 'Стенд з QR-кодом на місці' },
      { src: '/', credit: 'Фото локації' },
    ],
    galleryReconstruction: [
      { src: 'assets/images/data/holovna-yevreiska-synahoha/reconstruction/holovna-yevreiska-synahoha-digital-reconstruction-isometric.webp', credit: 'Цифрова реконструкція, 2026' },
      { src: 'assets/images/data/holovna-yevreiska-synahoha/reconstruction/holovna-yevreiska-synahoha-digital-reconstruction-front.webp', credit: 'Цифрова реконструкція (спереду), 2026' },
    ],
    galleryArchive: [
      { src: 'assets/images/data/holovna-yevreiska-synahoha/archive/holovna-yevreiska-synahoha-archive1.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/holovna-yevreiska-synahoha/archive/holovna-yevreiska-synahoha-archive2.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/holovna-yevreiska-synahoha/archive/holovna-yevreiska-synahoha-archive3.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/holovna-yevreiska-synahoha/archive/holovna-yevreiska-synahoha-archive4.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
    ],
  },

  // Південні брамні ворота
  {
    id: 'pivdenni-bramni-vorota',
    name: 'Південні брамні ворота',
    type: 'Ворота',
    description:
      'Південні брамні ворота у місті Березне — це втрачена історична пам\'ятка XVI століття, яка стояла в районі Нового Міста в напрямку Моквина. ' +
      'Споруда символізувала статус міста після одержання магдебурзького права, проте вона не збереглася до наших днів, оскільки її повністю розібрали у 1963 році.',
    yearsBuilt: 'XVI ст.',
    yearsDestroyed: '1963',
    location: {
      lat: 51.001553,
      lng: 26.746377,
      label: 'Південні брамні ворота \u2014 місце розташування',
    },
    model: {
      src: 'assets/models/pivdenni-bramni-vorota/model-draco.glb',
      iosSrc: 'assets/models/pivdenni-bramni-vorota/model-ios.usdz',
      alt: 'Цифрова 3D-реконструкція Південних брамних воріт',
      poster: 'assets/images/data/pivdenni-bramni-vorota/pivdenni-bramni-vorota-digital-reconstruction-poster.webp',
    },
    galleryNow: [
      { src: '/', credit: 'Стенд з QR-кодом на місці' },
      { src: '/', credit: 'Фото локації' },
    ],
    galleryReconstruction: [
      { src: 'assets/images/data/pivdenni-bramni-vorota/reconstruction/pivdenni-bramni-vorota-digital-reconstruction-isometric.webp', credit: 'Цифрова реконструкція, 2026' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/reconstruction/pivdenni-bramni-vorota-digital-reconstruction-front.webp', credit: 'Цифрова реконструкція, 2026' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/reconstruction/pivdenni-bramni-vorota-digital-reconstruction-side.webp', credit: 'Цифрова реконструкція (збоку), 2026' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/reconstruction/pivdenni-bramni-vorota-digital-reconstruction-back.webp', credit: 'Цифрова реконструкція, 2026' },
    ],
    galleryArchive: [
      { src: 'assets/images/data/pivdenni-bramni-vorota/archive/pivdenni-bramni-vorota-archive1.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/archive/pivdenni-bramni-vorota-archive2.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/archive/pivdenni-bramni-vorota-archive3.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
      { src: 'assets/images/data/pivdenni-bramni-vorota/archive/pivdenni-bramni-vorota-archive4.webp', credit: 'Фото 1930-х років. Колекція  Березнівського краєзнавчого музею.' },
    ],
  },
];

/**
 * Мініатюра для картки в меню об'єктів (index.html).
 * Використовує фоно із постера 3D-моделі, якщо він є, або плейсхолдер.
 * @param {object} landmark  об'єкт пам'ятки з LANDMARKS_DATA
 * @returns {string}  URL мініатюри для картки
 */
function getLandmarkCoverImage(landmark) {
  return landmark.model?.poster
    || 'assets/images/placeholders/image-placeholder.svg';
}

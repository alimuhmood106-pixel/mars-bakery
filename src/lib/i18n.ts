/** All page copy lives here. Kurdish (ku) and Arabic (ar) fall back to English for any missing key. */
export type Lang = "en" | "ku" | "ar";
export const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { id: "en", label: "EN", dir: "ltr" },
  { id: "ku", label: "کوردی", dir: "rtl" },
  { id: "ar", label: "العربية", dir: "rtl" },
];

const en = {
  nav_menu: "What we bake", nav_vibe: "The vibe", nav_visit: "Visit",
  tagline_a: "Life is too short.", tagline_b: "Stay awake for it!",
  open_now: "Open now · until 12 AM", opens_at: "Opens at 2 PM today",
  directions: "Get directions", call: "Call us",
  sticker_fresh: "Fresh daily", sticker_suly: "Baked in Sulaymaniyah",
  marquee: ["Croissants", "Cinnamon rolls", "Sourdough", "Cookies", "Matcha", "Espresso", "Pizza by the slice"],
  menu_kicker: "From our ovens", menu_title: "What we bake",
  menu_intro: "Short list, long mornings. Everything is made here, in small batches, by people who taste as they go.",
  croissant: "Dipped croissants", croissant_d: "Butter layers, dunked in chocolate and showered with pistachio. Messy on purpose.",
  cinnamon: "Glazed cinnamon rolls", cinnamon_d: "Soft, swirly and still warm — pull from the middle, that's the good part.",
  cookies: "Stuffed cookies", cookies_d: "Red velvet with cream cheese, and pistachio-Kinder that people drive across town for.",
  smores: "S'mores brownie cake", smores_d: "Fudgy brownie, biscuit crunch, a toasted marshmallow on top. Share it. Or don't.",
  matcha: "Iced matcha", matcha_d: "Bright green, properly whisked, not too sweet. Our summer in a cup.",
  espresso: "Espresso", espresso_d: "Small, strong, honest. The reason the tagline exists.",
  pizza: "Pizza by the slice", pizza_d: "Blistered crust, peppers and olives, out of the oven all evening long.",
  sourdough: "Signature sourdough", sourdough_d: "A slow, tangy loaf with a crackly crust. Ask what time it comes out.",
  vibe_kicker: "The vibe", vibe_quote: "Come for one coffee. Leave three chapters later.",
  vibe_note: "Swipe →",
  late_kicker: "After 2 PM", late_title: "Where Sulaymaniyah goes after lunch — and stays until midnight.",
  late_body: "We open when the city wakes up from its afternoon and keep the lights, the ovens and the espresso machine going until 12. Study dates, late pizza, one more cinnamon roll. We don't judge.",
  late_word: "Stay awake",
  visit_kicker: "Come by", visit_title: "Visit us",
  address: "Address", hours: "Hours", hours_v: "Every day · 2:00 PM – 12:00 AM", phone: "Phone", follow: "Follow",
  footer: "Mars Bakery & Café · Sulaymaniyah",
};
type Dict = typeof en;

const ku: Partial<Dict> = {
  nav_menu: "چی دەبرژێنین", nav_vibe: "کەشوهەوا", nav_visit: "سەردان",
  tagline_a: "ژیان زۆر کورتە.", tagline_b: "بە ئاگا بە بۆی!",
  open_now: "ئێستا کراوەیە · تا ١٢ی شەو", opens_at: "ئەمڕۆ کاتژمێر ٢ دەکرێتەوە",
  directions: "ڕێنمایی", call: "پەیوەندی",
  menu_title: "چی دەبرژێنین", vibe_kicker: "کەشوهەوا", visit_title: "سەردانمان بکە",
  hours_v: "هەموو ڕۆژێک · ٢ی دوانیوەڕۆ – ١٢ی شەو", address: "ناونیشان", hours: "کاتەکان", phone: "تەلەفۆن", follow: "فۆڵۆمان بکە",
};
const ar: Partial<Dict> = {
  nav_menu: "ماذا نخبز", nav_vibe: "الأجواء", nav_visit: "زورونا",
  tagline_a: "الحياة قصيرة جداً.", tagline_b: "ابقَ مستيقظاً لها!",
  open_now: "مفتوح الآن · حتى ١٢ منتصف الليل", opens_at: "نفتح اليوم الساعة ٢ ظهراً",
  directions: "الاتجاهات", call: "اتصل بنا",
  menu_title: "ماذا نخبز", vibe_kicker: "الأجواء", visit_title: "زورونا",
  hours_v: "يومياً · ٢:٠٠ ظهراً – ١٢:٠٠ منتصف الليل", address: "العنوان", hours: "الساعات", phone: "الهاتف", follow: "تابعونا",
};

const dicts: Record<Lang, Partial<Dict>> = { en, ku, ar };
export function t(lang: Lang) {
  return <K extends keyof Dict>(k: K): Dict[K] => (dicts[lang][k] ?? en[k]) as Dict[K];
}

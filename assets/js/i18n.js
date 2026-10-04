/**
 * ==========================================================================
 * EDUVIA GLOBAL INTERNATIONALIZATION & LOCALIZATION ENGINE (assets/js/i18n.js)
 * Robust, Modular, Vanilla JS Architecture for Countries, Languages & Currencies
 * ==========================================================================
 */

const EduviaI18n = {
  // Storage Keys
  STORAGE_KEYS: {
    COUNTRY: "eduvia_country",
    LANGUAGE: "eduvia_language",
    CURRENCY: "eduvia_currency"
  },

  // Active Runtime State
  activeCountry: "IN",
  activeLanguage: "en",
  activeCurrency: "INR",

  // --------------------------------------------------------------------------
  // 1. CENTRALIZED COUNTRIES & STUDY DESTINATIONS (23 Countries across 7 regions)
  // --------------------------------------------------------------------------
  countries: [
    // PRIMARY MARKET
    { code: "IN", name: "India", nativeName: "भारत", flag: "🇮🇳", region: "South Asia", defaultCurrency: "INR", defaultLanguage: "en", isPrimary: true },

    // SOUTH ASIA
    { code: "PK", name: "Pakistan", nativeName: "پاکستان", flag: "🇵🇰", region: "South Asia", defaultCurrency: "PKR", defaultLanguage: "ur" },
    { code: "BD", name: "Bangladesh", nativeName: "বাংলাদেশ", flag: "🇧🇩", region: "South Asia", defaultCurrency: "BDT", defaultLanguage: "bn" },
    { code: "LK", name: "Sri Lanka", nativeName: "ශ්‍රී ලංකාව", flag: "🇱🇰", region: "South Asia", defaultCurrency: "LKR", defaultLanguage: "ta" },
    { code: "NP", name: "Nepal", nativeName: "नेपाल", flag: "🇳🇵", region: "South Asia", defaultCurrency: "NPR", defaultLanguage: "hi" },

    // MIDDLE EAST
    { code: "AE", name: "United Arab Emirates", nativeName: "الإمارات", flag: "🇦🇪", region: "Middle East", defaultCurrency: "AED", defaultLanguage: "ar" },
    { code: "SA", name: "Saudi Arabia", nativeName: "المملكة العربية السعودية", flag: "🇸🇦", region: "Middle East", defaultCurrency: "SAR", defaultLanguage: "ar" },
    { code: "QA", name: "Qatar", nativeName: "قطر", flag: "🇶🇦", region: "Middle East", defaultCurrency: "QAR", defaultLanguage: "ar" },
    { code: "OM", name: "Oman", nativeName: "عُمان", flag: "🇴🇲", region: "Middle East", defaultCurrency: "OMR", defaultLanguage: "ar" },

    // NORTH AMERICA
    { code: "US", name: "United States", nativeName: "United States", flag: "🇺🇸", region: "North America", defaultCurrency: "USD", defaultLanguage: "en" },
    { code: "CA", name: "Canada", nativeName: "Canada", flag: "🇨🇦", region: "North America", defaultCurrency: "CAD", defaultLanguage: "en" },

    // EUROPE
    { code: "GB", name: "United Kingdom", nativeName: "United Kingdom", flag: "🇬🇧", region: "Europe", defaultCurrency: "GBP", defaultLanguage: "en" },
    { code: "DE", name: "Germany", nativeName: "Deutschland", flag: "🇩🇪", region: "Europe", defaultCurrency: "EUR", defaultLanguage: "de" },
    { code: "FR", name: "France", nativeName: "France", flag: "🇫🇷", region: "Europe", defaultCurrency: "EUR", defaultLanguage: "fr" },
    { code: "NL", name: "Netherlands", nativeName: "Nederland", flag: "🇳🇱", region: "Europe", defaultCurrency: "EUR", defaultLanguage: "en" },
    { code: "IE", name: "Ireland", nativeName: "Éire", flag: "🇮🇪", region: "Europe", defaultCurrency: "EUR", defaultLanguage: "en" },
    { code: "CH", name: "Switzerland", nativeName: "Schweiz", flag: "🇨🇭", region: "Europe", defaultCurrency: "CHF", defaultLanguage: "de" },

    // OCEANIA
    { code: "AU", name: "Australia", nativeName: "Australia", flag: "🇦🇺", region: "Oceania", defaultCurrency: "AUD", defaultLanguage: "en" },
    { code: "NZ", name: "New Zealand", nativeName: "New Zealand", flag: "🇳🇿", region: "Oceania", defaultCurrency: "NZD", defaultLanguage: "en" },

    // SOUTHEAST ASIA
    { code: "SG", name: "Singapore", nativeName: "Singapore", flag: "🇸🇬", region: "Southeast Asia", defaultCurrency: "SGD", defaultLanguage: "en" },
    { code: "MY", name: "Malaysia", nativeName: "Malaysia", flag: "🇲🇾", region: "Southeast Asia", defaultCurrency: "MYR", defaultLanguage: "en" },

    // AFRICA
    { code: "ZA", name: "South Africa", nativeName: "South Africa", flag: "🇿🇦", region: "Africa", defaultCurrency: "ZAR", defaultLanguage: "en" },
    { code: "NG", name: "Nigeria", nativeName: "Nigeria", flag: "🇳🇬", region: "Africa", defaultCurrency: "NGN", defaultLanguage: "en" },
    { code: "KE", name: "Kenya", nativeName: "Kenya", flag: "🇰🇪", region: "Africa", defaultCurrency: "KES", defaultLanguage: "en" }
  ],

  // --------------------------------------------------------------------------
  // 2. CENTRALIZED LANGUAGES (15 Languages with Native Scripts & Direction)
  // --------------------------------------------------------------------------
  languages: [
    { code: "en", name: "English", nativeName: "English", dir: "ltr" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", dir: "ltr" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
    { code: "ur", name: "Urdu", nativeName: "اردو", dir: "rtl" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം", dir: "ltr" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", dir: "ltr" },
    { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
    { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
    { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
    { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" }
  ],

  // --------------------------------------------------------------------------
  // 3. CENTRALIZED CURRENCIES & EXCHANGE RATES (Base Currency: INR)
  // Rate = 1 Unit of Foreign Currency in INR (e.g. 1 USD = 86.50 INR)
  // --------------------------------------------------------------------------
  currencies: [
    { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN", rateToINR: 1.0 },
    { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", rateToINR: 86.50 },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar", locale: "en-CA", rateToINR: 61.20 },
    { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", rateToINR: 108.40 },
    { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE", rateToINR: 92.10 },
    { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU", rateToINR: 54.60 },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE", rateToINR: 23.55 },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA", rateToINR: 23.05 },
    { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", locale: "ar-QA", rateToINR: 23.75 },
    { code: "OMR", symbol: "ر.ع.", name: "Omani Rial", locale: "ar-OM", rateToINR: 224.80 },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG", rateToINR: 64.30 },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY", rateToINR: 19.60 },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH", rateToINR: 96.20 },
    { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ", rateToINR: 49.30 },
    { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA", rateToINR: 4.65 },
    { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG", rateToINR: 0.057 },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE", rateToINR: 0.67 },
    { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD", rateToINR: 0.72 },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "ur-PK", rateToINR: 0.31 },
    { code: "NPR", symbol: "रू", name: "Nepalese Rupee", locale: "ne-NP", rateToINR: 0.625 },
    { code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", locale: "si-LK", rateToINR: 0.29 }
  ],

  // --------------------------------------------------------------------------
  // 4. TRANSLATION DICTIONARY (15 Languages for Core Microcopy & UI)
  // --------------------------------------------------------------------------
  translations: {
    en: {
      nav_home: "Home",
      nav_explore: "Explore",
      nav_programmes: "Programmes",
      nav_universities: "Universities",
      nav_compare: "Compare",
      nav_discover: "Discover",
      nav_resources: "Resources",
      nav_shortlist: "Shortlist",
      nav_login: "Login",
      nav_get_started: "Get Started",
      topbar_ugc: "UGC-DEB Recognized Degrees & Universities",
      topbar_counseling: "Academic Counseling Helpline",
      search_placeholder: "Search programmes, universities or specialisations...",
      filter_programmes: "Filter Programmes",
      filter_destination: "Study Destination / Country",
      filter_all_countries: "All Countries",
      filter_level: "Degree Level",
      filter_discipline: "Field / Discipline",
      filter_university: "University",
      filter_mode: "Study Mode",
      filter_fees: "Total Course Fees",
      filter_duration: "Duration",
      filter_clear_all: "Clear all",
      btn_view_programme: "View Programme",
      btn_view_university: "View University",
      btn_compare: "Compare",
      btn_shortlist: "Shortlist",
      btn_saved: "Saved",
      btn_apply_now: "Apply Now",
      btn_calculate_emi: "Calculate EMI",
      label_total_fee: "Total Course Fee",
      label_approx_monthly: "Approx. Monthly",
      label_original_fee: "Original Published Fee",
      label_approx_converted: "Approx. Converted",
      label_eligibility: "Eligibility",
      label_duration: "Duration",
      label_accreditation: "Accreditation",
      label_study_mode: "Study Mode",
      label_specialisation: "Specialisation",
      modal_pref_title: "Regional & Language Preferences",
      modal_tab_destination: "Study Destination",
      modal_tab_language: "Language",
      modal_tab_currency: "Currency",
      modal_search_countries: "Search countries or regions...",
      modal_btn_save: "Apply Preferences",
      ai_launcher_title: "Ask Eduvia",
      ai_launcher_sub: "AI Programme Discovery",
      ai_header_subtitle: "Your programme discovery assistant",
      ai_input_placeholder: "Ask about programmes, fees, eligibility...",
      ai_disclaimer: "Verified Eduvia dataset • Always verify statutory details directly with universities."
    },
    hi: {
      nav_home: "होम",
      nav_explore: "एक्सप्लोर करें",
      nav_programmes: "प्रोग्राम",
      nav_universities: "विश्वविद्यालय",
      nav_compare: "तुलना करें",
      nav_discover: "खोजें",
      nav_resources: "संसाधन",
      nav_shortlist: "शॉर्टलिस्ट",
      nav_login: "लॉगिन",
      nav_get_started: "शुरू करें",
      topbar_ugc: "UGC-DEB मान्यता प्राप्त डिग्रियां और विश्वविद्यालय",
      topbar_counseling: "शैक्षणिक परामर्श हेल्पलाइन",
      search_placeholder: "प्रोग्राम, विश्वविद्यालय या स्पेशलाइजेशन खोजें...",
      filter_programmes: "प्रोग्राम फ़िल्टर करें",
      filter_destination: "अध्ययन गंतव्य / देश",
      filter_all_countries: "सभी देश",
      filter_level: "डिग्री स्तर",
      filter_discipline: "क्षेत्र / विषय",
      filter_university: "विश्वविद्यालय",
      filter_mode: "अध्ययन मोड",
      filter_fees: "कुल कोर्स फीस",
      filter_duration: "अवधि",
      filter_clear_all: "सभी साफ़ करें",
      btn_view_programme: "प्रोग्राम देखें",
      btn_view_university: "विश्वविद्यालय देखें",
      btn_compare: "तुलना करें",
      btn_shortlist: "शॉर्टलिस्ट",
      btn_saved: "सहेजा गया",
      btn_apply_now: "अभी आवेदन करें",
      btn_calculate_emi: "EMI की गणना करें",
      label_total_fee: "कुल कोर्स फीस",
      label_approx_monthly: "अनुमानित मासिक",
      label_original_fee: "मूल प्रकाशित शुल्क",
      label_approx_converted: "अनुमानित रूपांतरित",
      label_eligibility: "पात्रता",
      label_duration: "अवधि",
      label_accreditation: "मान्यता",
      label_study_mode: "अध्ययन मोड",
      label_specialisation: "विशेषज्ञता",
      modal_pref_title: "क्षेत्रीय एवं भाषा प्राथमिकताएं",
      modal_tab_destination: "अध्ययन गंतव्य",
      modal_tab_language: "भाषा",
      modal_tab_currency: "मुद्रा",
      modal_search_countries: "देश या क्षेत्र खोजें...",
      modal_btn_save: "प्राथमिकताएं लागू करें",
      ai_launcher_title: "एडविया से पूछें",
      ai_launcher_sub: "एआई प्रोग्राम खोज सहायक",
      ai_header_subtitle: "आपका प्रोग्राम खोज सहायक",
      ai_input_placeholder: "प्रोग्राम, फीस, पात्रता के बारे में पूछें...",
      ai_disclaimer: "सत्यापित एडविया डेटासेट • विश्वविद्यालय से आधिकारिक विवरण सत्यापित करें।"
    },
    pa: {
      nav_home: "ਘਰ",
      nav_explore: "ਖੋਜੋ",
      nav_programmes: "ਪ੍ਰੋਗਰਾਮ",
      nav_universities: "ਯੂਨੀਵਰਸਿਟੀਆਂ",
      nav_compare: "ਤੁਲਨਾ ਕਰੋ",
      nav_discover: "ਲੱਭੋ",
      nav_resources: "ਸਰੋਤ",
      nav_shortlist: "ਸ਼ਾਰਟਲਿਸਟ",
      nav_login: "ਲਾਗਇਨ",
      nav_get_started: "ਸ਼ੁਰੂ ਕਰੋ",
      topbar_ugc: "UGC-DEB ਪ੍ਰਵਾਨਿਤ ਡਿਗਰੀਆਂ ਅਤੇ ਯੂਨੀਵਰਸਿਟੀਆਂ",
      topbar_counseling: "ਅਕਾਦਮਿਕ ਕਾਉਂਸਲਿੰਗ ਹੈਲਪਲਾਈਨ",
      search_placeholder: "ਪ੍ਰੋਗਰਾਮ ਜਾਂ ਯੂਨੀਵਰਸਿਟੀ ਖੋਜੋ...",
      filter_programmes: "ਪ੍ਰੋਗਰਾਮ ਫਿਲਟਰ",
      filter_destination: "ਦੇਸ਼ / ਗੰਤਵ",
      filter_all_countries: "ਸਾਰੇ ਦੇਸ਼",
      filter_level: "ਡਿਗਰੀ ਪੱਧਰ",
      filter_discipline: "ਖੇਤਰ",
      filter_university: "ਯੂਨੀਵਰਸਿਟੀ",
      filter_mode: "ਸਟੱਡੀ ਮੋਡ",
      filter_fees: "ਕੁੱਲ ਫੀਸ",
      filter_duration: "ਮਿਆਦ",
      filter_clear_all: "ਸਾਰੇ ਹਟਾਓ",
      btn_view_programme: "ਪ੍ਰੋਗਰਾਮ ਵੇਖੋ",
      btn_view_university: "ਯੂਨੀਵਰਸਿਟੀ ਵੇਖੋ",
      btn_compare: "ਤੁਲਨਾ ਕਰੋ",
      btn_shortlist: "ਸ਼ਾਰਟਲਿਸਟ",
      btn_saved: "ਸੰਭਾਲਿਆ ਗਿਆ",
      btn_apply_now: "ਅਰਜ਼ੀ ਦਿਓ",
      btn_calculate_emi: "EMI ਕੈਲਕੁਲੇਟਰ",
      label_total_fee: "ਕੁੱਲ ਕੋਰਸ ਫੀਸ",
      label_approx_monthly: "ਲਗਭਗ ਮਹੀਨਾਵਾਰ",
      label_original_fee: "ਅਸਲ ਫੀਸ",
      label_approx_converted: "ਲਗਭਗ ਬਦਲੀ ਹੋਈ ਫੀਸ",
      label_eligibility: "ਯੋਗਤਾ",
      label_duration: "ਮਿਆਦ",
      label_accreditation: "ਮਾਨਤਾ",
      label_study_mode: "ਸਟੱਡੀ ਮੋਡ",
      label_specialisation: "ਵਿਸ਼ੇਸ਼ਤਾ",
      modal_pref_title: "ਖੇਤਰੀ ਅਤੇ ਭਾਸ਼ਾ ਤਰਜੀਹਾਂ",
      modal_tab_destination: "ਸਟੱਡੀ ਦੇਸ਼",
      modal_tab_language: "ਭਾਸ਼ਾ",
      modal_tab_currency: "ਮੁਦਰਾ",
      modal_search_countries: "ਦੇਸ਼ ਖੋਜੋ...",
      modal_btn_save: "ਲਾਗੂ ਕਰੋ",
      ai_launcher_title: "ਐਜੂਵੀਆ ਨੂੰ ਪੁੱਛੋ",
      ai_launcher_sub: "AI ਪ੍ਰੋਗਰਾਮ ਸਹਾਇਕ",
      ai_header_subtitle: "ਤੁਹਾਡਾ ਪ੍ਰੋਗਰਾਮ ਖੋਜ ਸਹਾਇਕ",
      ai_input_placeholder: "ਕੋਰਸ, ਫੀਸ ਜਾਂ ਯੋਗਤਾ ਬਾਰੇ ਪੁੱਛੋ...",
      ai_disclaimer: "ਪ੍ਰਮਾਣਿਤ ਡਾਟਾ • ਯੂਨੀਵਰਸਿਟੀ ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ।"
    },
    ar: {
      nav_home: "الرئيسية",
      nav_explore: "استكشف",
      nav_programmes: "البرامج الأكاديمية",
      nav_universities: "الجامعات",
      nav_compare: "مقارنة",
      nav_discover: "مسارات التعلم",
      nav_resources: "المصادر والمقالات",
      nav_shortlist: "المفضلة",
      nav_login: "تسجيل الدخول",
      nav_get_started: "ابدأ الآن",
      topbar_ugc: "درجات وجامعات معتمدة رسمياً وموثوقة",
      topbar_counseling: "خط المساعدة للإرشاد الأكاديمي",
      search_placeholder: "ابحث عن البرامج، الجامعات أو التخصصات...",
      filter_programmes: "تصفية البرامج",
      filter_destination: "وجهة الدراسة / الدولة",
      filter_all_countries: "جميع الدول",
      filter_level: "المستوى الأكاديمي",
      filter_discipline: "مجال الدراسة",
      filter_university: "الجامعة",
      filter_mode: "نمط الدراسة",
      filter_fees: "إجمالي الرسوم الدراسية",
      filter_duration: "المدة",
      filter_clear_all: "إعادة ضبط الفلاتر",
      btn_view_programme: "عرض البرنامج",
      btn_view_university: "عرض الجامعة",
      btn_compare: "مقارنة",
      btn_shortlist: "إضافة للمفضلة",
      btn_saved: "تم الحفظ",
      btn_apply_now: "قدم الآن",
      btn_calculate_emi: "حساب الأقساط الشهرية",
      label_total_fee: "إجمالي الرسوم الدراسية",
      label_approx_monthly: "تقريباً شهرياً",
      label_original_fee: "الرسوم الأصلية المعلنة",
      label_approx_converted: "الرسوم التقريبية المحولة",
      label_eligibility: "شروط القبول",
      label_duration: "المدة الدراسية",
      label_accreditation: "الاعتمادات",
      label_study_mode: "نمط الدراسة",
      label_specialisation: "التخصص الدقيق",
      modal_pref_title: "تفضيلات الدولة واللغة والعملة",
      modal_tab_destination: "وجهة الدراسة",
      modal_tab_language: "اللغة",
      modal_tab_currency: "العملة",
      modal_search_countries: "ابحث عن دولة أو منطقة...",
      modal_btn_save: "حفظ وتطبيق التفضيلات",
      ai_launcher_title: "اسأل إيدوفيا",
      ai_launcher_sub: "مساعد اكتشاف البرامج الذكي",
      ai_header_subtitle: "مساعدك الأكاديمي لاكتشاف البرامج والجامعات",
      ai_input_placeholder: "اسأل عن البرامج، الرسوم، شروط القبول...",
      ai_disclaimer: "بيانات موثوقة • يرجى التحقق دائماً مباشرة من الجامعات."
    },
    ur: {
      nav_home: "ہوم",
      nav_explore: "تلاش کریں",
      nav_programmes: "پروگرامز",
      nav_universities: "یونیورسٹیاں",
      nav_compare: "موازنہ کریں",
      nav_discover: "دریافت کریں",
      nav_resources: "وسائل",
      nav_shortlist: "شارٹ لسٹ",
      nav_login: "لاگ ان",
      nav_get_started: "شروع کریں",
      topbar_ugc: "تسلیم شدہ ڈگریاں اور یونیورسٹیاں",
      topbar_counseling: "تعلیمی رہنمائی ہیلپ لائن",
      search_placeholder: "پروگرامز، یونیورسٹیاں یا شعبہ جات تلاش کریں...",
      filter_programmes: "پروگرامز فلٹر کریں",
      filter_destination: "تعلیمی ملک / منزل",
      filter_all_countries: "تمام ممالک",
      filter_level: "ڈگری کی سطح",
      filter_discipline: "شعبہ تعلیم",
      filter_university: "یونیورسٹی",
      filter_mode: "طریقہ تعلیم",
      filter_fees: "کل فیس",
      filter_duration: "مدت",
      filter_clear_all: "تمام فلٹرز ختم کریں",
      btn_view_programme: "پروگرام دیکھیں",
      btn_view_university: "یونیورسٹی دیکھیں",
      btn_compare: "موازنہ",
      btn_shortlist: "شارٹ لسٹ",
      btn_saved: "محفوظ",
      btn_apply_now: "درخواست دیں",
      btn_calculate_emi: "ماہانہ قسط",
      label_total_fee: "کل تعلیمی فیس",
      label_approx_monthly: "تقریباً ماہانہ",
      label_original_fee: "اصل شائع شدہ فیس",
      label_approx_converted: "تبدیل شدہ تخمینہ",
      label_eligibility: "اہلیت کا معیار",
      label_duration: "مدت",
      label_accreditation: "منظوری",
      label_study_mode: "طریقہ تعلیم",
      label_specialisation: "تخصص",
      modal_pref_title: "علاقائی اور زبان کی ترجیحات",
      modal_tab_destination: "تعلیمی ملک",
      modal_tab_language: "زبان",
      modal_tab_currency: "کرنسی",
      modal_search_countries: "ملک تلاش کریں...",
      modal_btn_save: "ترجیحات لاگو کریں",
      ai_launcher_title: "ایڈوویا سے پوچھیں",
      ai_launcher_sub: "AI تعلیمی معاون",
      ai_header_subtitle: "آپ کا تعلیمی پروگرام دریافت معاون",
      ai_input_placeholder: "کورس، فیس یا اہلیت کے بارے میں پوچھیں...",
      ai_disclaimer: "تصدیق شدہ ڈیٹا • حتمی تفصیلات یونیورسٹی سے چیک کریں۔"
    },
    bn: {
      nav_home: "হোম",
      nav_explore: "অন্বেষণ",
      nav_programmes: "প্রোগ্রামসমূহ",
      nav_universities: "বিশ্ববিদ্যালয়",
      nav_compare: "তুলনা করুন",
      nav_discover: "আবিষ্কার",
      nav_resources: "রিসোর্স",
      nav_shortlist: "সংরক্ষিত",
      nav_login: "লগইন",
      nav_get_started: "শুরু করুন",
      topbar_ugc: "অনুমোদিত ডিগ্রি ও বিশ্ববিদ্যালয়",
      topbar_counseling: "একাডেমিক কাউন্সেলিং হেল্পলাইন",
      search_placeholder: "প্রোগ্রাম বা বিশ্ববিদ্যালয় খুঁজুন...",
      filter_programmes: "ফিল্টার",
      filter_destination: "গন্তব্য / দেশ",
      filter_all_countries: "সকল দেশ",
      filter_level: "ডিগ্রি স্তর",
      filter_discipline: "বিষয়",
      filter_university: "বিশ্ববিদ্যালয়",
      filter_mode: "স্টাডি মোড",
      filter_fees: "মোট ফি",
      filter_duration: "মেয়াদ",
      filter_clear_all: "রিসেট",
      btn_view_programme: "প্রোগ্রাম দেখুন",
      btn_view_university: "বিশ্ববিদ্যালয় দেখুন",
      btn_compare: "তুলনা",
      btn_shortlist: "সংরক্ষণ",
      btn_saved: "সংরক্ষিত",
      btn_apply_now: "আবেদন করুন",
      btn_calculate_emi: "ইএমআই ক্যালকুলেটর",
      label_total_fee: "মোট কোর্স ফি",
      label_approx_monthly: "মাসিক আনুমানিক",
      label_original_fee: "মূল ফি",
      label_approx_converted: "রূপান্তরিত আনুমানিক ফি",
      label_eligibility: "যোগ্যতা",
      label_duration: "মেয়াদ",
      label_accreditation: "স্বীকৃতি",
      label_study_mode: "পদ্ধতি",
      label_specialisation: "বিশেষায়ন",
      modal_pref_title: "ভাষা ও অঞ্চল সেটিংস",
      modal_tab_destination: "দেশ",
      modal_tab_language: "ভাষা",
      modal_tab_currency: "মুদ্রা",
      modal_search_countries: "দেশ খুঁজুন...",
      modal_btn_save: "প্রয়োগ করুন",
      ai_launcher_title: "এডুভিয়াকে জিজ্ঞাসা করুন",
      ai_launcher_sub: "এআই প্রোগ্রাম আবিষ্কার",
      ai_header_subtitle: "আপনার শিক্ষাগত প্রোগ্রাম সহকারী",
      ai_input_placeholder: "প্রোগ্রাম, ফি বা যোগ্যতা সম্পর্কে জিজ্ঞাসা করুন...",
      ai_disclaimer: "যাচাইকৃত ডাটা • বিশ্ববিদ্যালয়ের তথ্য যাচাই করুন।"
    },
    ta: {
      nav_home: "முகப்பு",
      nav_explore: "ஆராயுங்கள்",
      nav_programmes: "திட்டங்கள்",
      nav_universities: "பல்கலைக்கழகங்கள்",
      nav_compare: "ஒப்பிடுங்கள்",
      nav_discover: "கண்டுபிடி",
      nav_resources: "வளங்கள்",
      nav_shortlist: "பட்டியல்",
      nav_login: "உள்நுழைக",
      nav_get_started: "தொடங்குங்கள்",
      topbar_ugc: "அங்கீகரிக்கப்பட்ட பட்டங்கள் மற்றும் பல்கலைக்கழகங்கள்",
      topbar_counseling: "கல்வி ஆலோசனை உதவி எண்",
      search_placeholder: "படிப்புகள் அல்லது பல்கலைக்கழகங்களை தேடுங்கள்...",
      filter_programmes: "வடிகட்டிகள்",
      filter_destination: "படிப்பு நாடு",
      filter_all_countries: "அனைத்து நாடுகள்",
      filter_level: "பட்டப் படிப்பு நிலை",
      filter_discipline: "துறை",
      filter_university: "பல்கலைக்கழகம்",
      filter_mode: "படிப்பு முறை",
      filter_fees: "மொத்த கட்டணம்",
      filter_duration: "கால அளவு",
      filter_clear_all: "அனைத்தையும் அழி",
      btn_view_programme: "திட்டத்தை காண்க",
      btn_view_university: "பல்கலைக்கழகத்தை காண்க",
      btn_compare: "ஒப்பிடு",
      btn_shortlist: "பட்டியலிடு",
      btn_saved: "சேமிக்கப்பட்டது",
      btn_apply_now: "விண்ணப்பிக்கவும்",
      btn_calculate_emi: "மாதத்தவணை கணக்கிடு",
      label_total_fee: "மொத்த படிப்பு கட்டணம்",
      label_approx_monthly: "மாதாந்திர தோராய கட்டணம்",
      label_original_fee: "அசல் கட்டணம்",
      label_approx_converted: "மாற்றப்பட்ட தோராய கட்டணம்",
      label_eligibility: "தகுதி",
      label_duration: "கால அளவு",
      label_accreditation: "அங்கீகாரம்",
      label_study_mode: "படிப்பு முறை",
      label_specialisation: "சிறப்புத் துறை",
      modal_pref_title: "பிராந்திய மற்றும் மொழி விருப்பத்தேர்வுகள்",
      modal_tab_destination: "நாடு",
      modal_tab_language: "மொழி",
      modal_tab_currency: "நாணயம்",
      modal_search_countries: "நாடுகளை தேடுங்கள்...",
      modal_btn_save: "பயன்படுத்துக",
      ai_launcher_title: "Eduvia-விடம் கேளுங்கள்",
      ai_launcher_sub: "AI கல்வி உதவியாளர்",
      ai_header_subtitle: "உங்கள் கல்வி திட்ட வழிகாட்டி",
      ai_input_placeholder: "கட்டணம், தகுதி அல்லது படிப்புகளை பற்றி கேளுங்கள்...",
      ai_disclaimer: "சரிபார்க்கப்பட்ட தகவல் • பல்கலைக்கழகத்திடம் உறுதிப்படுத்தவும்."
    },
    te: {
      nav_home: "హోమ్",
      nav_explore: "అన్వేషించండి",
      nav_programmes: "కోర్సులు",
      nav_universities: "విశ్వవిద్యాలయాలు",
      nav_compare: "పోల్చండి",
      nav_discover: "కనుగొనండి",
      nav_resources: "వనరులు",
      nav_shortlist: "షార్ట్‌లిస్ట్",
      nav_login: "లాగిన్",
      nav_get_started: "ప్రారంభించండి",
      topbar_ugc: "గుర్తింపు పొందిన డిగ్రీలు & విశ్వవిద్యాలయాలు",
      topbar_counseling: "విద్యా సలహా హెల్ప్‌లైన్",
      search_placeholder: "కోర్సులు లేదా విశ్వవిద్యాలయాల కోసం శోధించండి...",
      filter_programmes: "ఫిల్టర్లు",
      filter_destination: "చదువు దేశం",
      filter_all_countries: "అన్ని దేశాలు",
      filter_level: "డిగ్రీ స్థాయి",
      filter_discipline: "విభాగం",
      filter_university: "విశ్వవిద్యాలయం",
      filter_mode: "స్టడీ మోడ్",
      filter_fees: "మొత్తం ఫీజు",
      filter_duration: "వ్యవధి",
      filter_clear_all: "రీసెట్",
      btn_view_programme: "కోర్సు చూడండి",
      btn_view_university: "విశ్వవిద్యాలయం చూడండి",
      btn_compare: "పోల్చండి",
      btn_shortlist: "షార్ట్‌లిస్ట్",
      btn_saved: "సేవ్ చేయబడింది",
      btn_apply_now: "దరఖాస్తు చేయండి",
      btn_calculate_emi: "EMI లెక్కించండి",
      label_total_fee: "మొత్తం కోర్సు ఫీజు",
      label_approx_monthly: "సుమారు నెలవారీ",
      label_original_fee: "అసలు ఫీజు",
      label_approx_converted: "మార్చబడిన అంచనా",
      label_eligibility: "అర్హత",
      label_duration: "వ్యవధి",
      label_accreditation: "గుర్తింపు",
      label_study_mode: "స్టడీ మోడ్",
      label_specialisation: "స్పెషలైజేషన్",
      modal_pref_title: "భాష & ప్రాంత ప్రాధాన్యతలు",
      modal_tab_destination: "దేశం",
      modal_tab_language: "భాష",
      modal_tab_currency: "కరెన్సీ",
      modal_search_countries: "దేశాలను శోధించండి...",
      modal_btn_save: "వర్తింపజేయి",
      ai_launcher_title: "Eduvia ని అడగండి",
      ai_launcher_sub: "AI ప్రోగ్రామ్ డిస్కవరీ",
      ai_header_subtitle: "మీ విద్యా మార్గదర్శి",
      ai_input_placeholder: "కోర్సులు, ఫీజులు, అర్హతల గురించి అడగండి...",
      ai_disclaimer: "ధృవీకరించబడిన డేటా • యూనివర్సిటీతో తనిఖీ చేయండి."
    },
    mr: {
      nav_home: "मुख्यपृष्ठ",
      nav_explore: "शोधा",
      nav_programmes: "अभ्यासक्रम",
      nav_universities: "विद्यापीठे",
      nav_compare: "तुलना करा",
      nav_discover: "मार्गदर्शन",
      nav_resources: "साधने",
      nav_shortlist: "निवडक",
      nav_login: "लॉगिन",
      nav_get_started: "सुरुवात करा",
      topbar_ugc: "मान्यताप्राप्त पदव्या आणि विद्यापीठे",
      topbar_counseling: "शैक्षणिक समुपदेशन हेल्पलाइन",
      search_placeholder: "अभ्यासक्रम किंवा विद्यापीठ शोधा...",
      filter_programmes: "फिल्टर्स",
      filter_destination: "शिक्षण देश",
      filter_all_countries: "सर्व देश",
      filter_level: "पदवी स्तर",
      filter_discipline: "शाखा",
      filter_university: "विद्यापीठ",
      filter_mode: "पद्धती",
      filter_fees: "एकूण शुल्क",
      filter_duration: "कालावधी",
      filter_clear_all: "सर्व साफ करा",
      btn_view_programme: "अभ्यासक्रम पहा",
      btn_view_university: "विद्यापीठ पहा",
      btn_compare: "तुलना",
      btn_shortlist: "शॉर्टलिस्ट",
      btn_saved: "जतन केले",
      btn_apply_now: "अर्ज करा",
      btn_calculate_emi: "ईएमआय गणना",
      label_total_fee: "एकूण अभ्यासक्रम शुल्क",
      label_approx_monthly: "अंदाजे मासिक",
      label_original_fee: "मूळ शुल्क",
      label_approx_converted: "रूपांतरित अंदाज",
      label_eligibility: "पात्रता",
      label_duration: "कालावधी",
      label_accreditation: "मान्यता",
      label_study_mode: "अभ्यास पद्धत",
      label_specialisation: "विशेषीकरण",
      modal_pref_title: "प्रादेशिक व भाषा प्राधान्ये",
      modal_tab_destination: "देश",
      modal_tab_language: "भाषा",
      modal_tab_currency: "चलन",
      modal_search_countries: "देश शोधा...",
      modal_btn_save: "लागू करा",
      ai_launcher_title: "Eduvia ला विचारा",
      ai_launcher_sub: "AI अभ्यासक्रम सहाय्यक",
      ai_header_subtitle: "तुमचा शैक्षणिक मार्गदर्शक",
      ai_input_placeholder: "अभ्यासक्रम, शुल्क किंवा पात्रतेबद्दल विचारा...",
      ai_disclaimer: "प्रमाणित माहिती • विद्यापीठाशी पडताळणी करा."
    },
    gu: {
      nav_home: "હોમ",
      nav_explore: "શોધો",
      nav_programmes: "પ્રોગ્રામ્સ",
      nav_universities: "યુનિવર્સિટીઓ",
      nav_compare: "સરખામણી",
      nav_discover: "માર્ગદર્શન",
      nav_resources: "સંસાધનો",
      nav_shortlist: "શોર્ટલિસ્ટ",
      nav_login: "લૉગિન",
      nav_get_started: "શરૂ કરો",
      topbar_ugc: "માન્યતા પ્રાપ્ત ડિગ્રી અને યુનિવર્સિટીઓ",
      topbar_counseling: "શૈક્ષણિક કાઉન્સેલિંગ હેલ્પલાઇન",
      search_placeholder: "પ્રોગ્રામ અથવા યુનિવર્સિટી શોધો...",
      filter_programmes: "ફિલ્ટર્સ",
      filter_destination: "અભ્યાસ દેશ",
      filter_all_countries: "બધા દેશો",
      filter_level: "ડિગ્રી સ્તર",
      filter_discipline: "વિષય",
      filter_university: "યુનિવર્સિટી",
      filter_mode: "અભ્યાસ પદ્ધતિ",
      filter_fees: "કુલ ફી",
      filter_duration: "સમયગાળો",
      filter_clear_all: "બધું સાફ કરો",
      btn_view_programme: "પ્રોગ્રામ જુઓ",
      btn_view_university: "યુનિવર્સિટી જુઓ",
      btn_compare: "સરખામણી કરો",
      btn_shortlist: "શોર્ટલિસ્ટ",
      btn_saved: "સાચવેલ",
      btn_apply_now: "અરજી કરો",
      btn_calculate_emi: "EMI ગણો",
      label_total_fee: "કુલ કોર્સ ફી",
      label_approx_monthly: "અંદાજે માસિક",
      label_original_fee: "મૂળ ફી",
      label_approx_converted: "રૂપાંતરિત અંદાજ",
      label_eligibility: "લાયકાત",
      label_duration: "સમયગાળો",
      label_accreditation: "માન્યતા",
      label_study_mode: "અભ્યાસ મોડ",
      label_specialisation: "વિશેષતા",
      modal_pref_title: "ભાષા અને દેશ પસંદગી",
      modal_tab_destination: "દેશ",
      modal_tab_language: "ભાષા",
      modal_tab_currency: "ચલણ",
      modal_search_countries: "દેશ શોધો...",
      modal_btn_save: "લાગુ કરો",
      ai_launcher_title: "Eduvia ને પૂછો",
      ai_launcher_sub: "AI પ્રોગ્રામ સહાયક",
      ai_header_subtitle: "તમારો શૈક્ષણિક સહાયક",
      ai_input_placeholder: "કોર્સ, ફી અથવા લાયકાત વિશે પૂછો...",
      ai_disclaimer: "ચકાસાયેલ ડેટા • યુનિવર્સિટી સાથે ચકાસો."
    },
    ml: {
      nav_home: "ഹോം",
      nav_explore: "കണ്ടെത്തുക",
      nav_programmes: "പ്രോഗ്രാമുകൾ",
      nav_universities: "സർവ്വകലാശാലകൾ",
      nav_compare: "താരതമ്യം",
      nav_discover: "വഴികാട്ടി",
      nav_resources: "വിവരങ്ങൾ",
      nav_shortlist: "ലിസ്റ്റ്",
      nav_login: "ലോഗിൻ",
      nav_get_started: "ആരംഭിക്കുക",
      topbar_ugc: "അംഗീകൃത ബിരുദങ്ങളും സർവ്വകലാശാലകളും",
      topbar_counseling: "അക്കാദമിക് കൗൺസിലിംഗ് ഹെൽപ്പ് ലൈൻ",
      search_placeholder: "കോഴ്സുകൾ അല്ലെങ്കിൽ സർവ്വകലാശാലകൾ തിരയുക...",
      filter_programmes: "ഫിൽട്ടറുകൾ",
      filter_destination: "പഠന രാജ്യം",
      filter_all_countries: "എല്ലാ രാജ്യങ്ങളും",
      filter_level: "ബിരുദ തലം",
      filter_discipline: "വിഭാഗം",
      filter_university: "സർവ്വകലാശാല",
      filter_mode: "പഠന രീതി",
      filter_fees: "ആകെ ഫീസ്",
      filter_duration: "കാലയളവ്",
      filter_clear_all: "മായ്ക്കുക",
      btn_view_programme: "പ്രോഗ്രാം കാണുക",
      btn_view_university: "സർവ്വകലാശാല കാണുക",
      btn_compare: "താരതമ്യം ചെയ്യുക",
      btn_shortlist: "ലിസ്റ്റിലേക്ക് മാറ്റുക",
      btn_saved: "സേവ് ചെയ്തു",
      btn_apply_now: "അപേക്ഷിക്കുക",
      btn_calculate_emi: "EMI കണക്കാക്കുക",
      label_total_fee: "ആകെ കോഴ്സ് ഫീസ്",
      label_approx_monthly: "പ്രതിമാസ ഏകദേശ തുക",
      label_original_fee: "യഥാർത്ഥ ഫീസ്",
      label_approx_converted: "ഏകദേശ തുക",
      label_eligibility: "യോഗ്യത",
      label_duration: "കാലയളവ്",
      label_accreditation: "അംഗീകാരം",
      label_study_mode: "പഠന രീതി",
      label_specialisation: "പ്രത്യേക വിഷയം",
      modal_pref_title: "ഭാഷയും രാജ്യവും തിരഞ്ഞെടുക്കുക",
      modal_tab_destination: "രാജ്യം",
      modal_tab_language: "ഭാഷ",
      modal_tab_currency: "കറൻസി",
      modal_search_countries: "രാജ്യങ്ങൾ തിരയുക...",
      modal_btn_save: "സേവ് ചെയ്യുക",
      ai_launcher_title: "Eduvia-യോട് ചോദിക്കുക",
      ai_launcher_sub: "AI കോഴ്സ് ഗൈഡ്",
      ai_header_subtitle: "നിങ്ങളുടെ പഠന സഹായി",
      ai_input_placeholder: "കോഴ്സ്, ഫീസ്, യോഗ്യത എന്നിവ ചോദിക്കുക...",
      ai_disclaimer: "സ്ഥിരീകരിച്ച വിവരങ്ങൾ • സർവ്വകലാശാലയുമായി ഒത്തുനോക്കുക."
    },
    kn: {
      nav_home: "ಮುಖಪುಟ",
      nav_explore: "ಅನ್ವೇಷಿಸಿ",
      nav_programmes: "ಕಾರ್ಯಕ್ರಮಗಳು",
      nav_universities: "ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು",
      nav_compare: "ಹೋಲಿಕೆ ಮಾಡಿ",
      nav_discover: "ಮಾರ್ಗದರ್ಶಿ",
      nav_resources: "ಸಂಪನ್ಮೂಲಗಳು",
      nav_shortlist: "ಆಯ್ಕೆಪಟ್ಟಿ",
      nav_login: "ಲಾಗಿನ್",
      nav_get_started: "ಪ್ರಾರಂಭಿಸಿ",
      topbar_ugc: "ಮಾನ್ಯತೆ ಪಡೆದ ಪದವಿಗಳು ಮತ್ತು ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು",
      topbar_counseling: "ಶೈಕ್ಷಣಿಕ ಸಮಾಲೋಚನೆ ಸಹಾಯವಾಣಿ",
      search_placeholder: "ಕೋರ್ಸ್‌ಗಳು ಅಥವಾ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳನ್ನು ಹುಡುಕಿ...",
      filter_programmes: "ಫಿಲ್ಟರ್‌ಗಳು",
      filter_destination: "ಅಧ್ಯಯನ ದೇಶ",
      filter_all_countries: "ಎಲ್ಲಾ ದೇಶಗಳು",
      filter_level: "ಪದವಿ ಮಟ್ಟ",
      filter_discipline: "ವಿಭಾಗ",
      filter_university: "ವಿಶ್ವವಿದ್ಯಾಲಯ",
      filter_mode: "ಅಧ್ಯಯನ ವಿಧಾನ",
      filter_fees: "ಒಟ್ಟು ಶುಲ್ಕ",
      filter_duration: "ಅವಧಿ",
      filter_clear_all: "ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ",
      btn_view_programme: "ಕಾರ್ಯಕ್ರಮ ವೀಕ್ಷಿಸಿ",
      btn_view_university: "ವಿಶ್ವವಿದ್ಯಾಲಯ ವೀಕ್ಷಿಸಿ",
      btn_compare: "ಹೋಲಿಕೆ",
      btn_shortlist: "ಶಾರ್ಟ್‌ಲಿಸ್ಟ್",
      btn_saved: "ಉಳಿಸಲಾಗಿದೆ",
      btn_apply_now: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      btn_calculate_emi: "EMI ಲೆಕ್ಕಾಚಾರ",
      label_total_fee: "ಒಟ್ಟು ಕೋರ್ಸ್ ಶುಲ್ಕ",
      label_approx_monthly: "ಅಂದಾಜು ಮಾಸಿಕ",
      label_original_fee: "ಮೂಲ ಶುಲ್ಕ",
      label_approx_converted: "ಪರಿವರ್ತಿತ ಅಂದಾಜು",
      label_eligibility: "ಅರ್ಹತೆ",
      label_duration: "ಅವಧಿ",
      label_accreditation: "ಮಾನ್ಯತೆ",
      label_study_mode: "ವಿಧಾನ",
      label_specialisation: "ವಿಶೇಷತೆ",
      modal_pref_title: "ಭಾಷೆ ಮತ್ತು ಪ್ರದೇಶ ಆದ್ಯತೆಗಳು",
      modal_tab_destination: "ದೇಶ",
      modal_tab_language: "ಭಾಷೆ",
      modal_tab_currency: "ಕರೆನ್ಸಿ",
      modal_search_countries: "ದೇಶಗಳನ್ನು ಹುಡುಕಿ...",
      modal_btn_save: "ಅನ್ವಯಿಸಿ",
      ai_launcher_title: "Eduvia ಗೆ ಕೇಳಿ",
      ai_launcher_sub: "AI ಕೋರ್ಸ್ ಸಹಾಯಕ",
      ai_header_subtitle: "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶಿ",
      ai_input_placeholder: "ಕೋರ್ಸ್, ಶುಲ್ಕ ಅಥವಾ ಅರ್ಹತೆ ಬಗ್ಗೆ ಕೇಳಿ...",
      ai_disclaimer: "ದೃಢೀಕೃತ ಮಾಹಿತಿ • ವಿಶ್ವವಿದ್ಯಾಲಯದೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿ."
    },
    fr: {
      nav_home: "Accueil",
      nav_explore: "Explorer",
      nav_programmes: "Programmes",
      nav_universities: "Universités",
      nav_compare: "Comparer",
      nav_discover: "Découvrir",
      nav_resources: "Ressources",
      nav_shortlist: "Sélection",
      nav_login: "Connexion",
      nav_get_started: "Commencer",
      topbar_ugc: "Diplômes et universités officiellement reconnus",
      topbar_counseling: "Ligne d'assistance aux études",
      search_placeholder: "Rechercher programmes, universités ou spécialisations...",
      filter_programmes: "Filtrer les programmes",
      filter_destination: "Destination d'études / Pays",
      filter_all_countries: "Tous les pays",
      filter_level: "Niveau de diplôme",
      filter_discipline: "Discipline",
      filter_university: "Université",
      filter_mode: "Mode d'études",
      filter_fees: "Frais totaux de scolarité",
      filter_duration: "Durée",
      filter_clear_all: "Effacer les filtres",
      btn_view_programme: "Voir le programme",
      btn_view_university: "Voir l'université",
      btn_compare: "Comparer",
      btn_shortlist: "Ajouter aux favoris",
      btn_saved: "Enregistré",
      btn_apply_now: "Postuler",
      btn_calculate_emi: "Calculer les mensualités",
      label_total_fee: "Frais totaux",
      label_approx_monthly: "Mensualité approx.",
      label_original_fee: "Frais officiels publiés",
      label_approx_converted: "Montant converti approx.",
      label_eligibility: "Conditions d'admission",
      label_duration: "Durée",
      label_accreditation: "Accréditation",
      label_study_mode: "Mode d'études",
      label_specialisation: "Spécialisation",
      modal_pref_title: "Préférences régionales et linguistiques",
      modal_tab_destination: "Destination d'études",
      modal_tab_language: "Langue",
      modal_tab_currency: "Devise",
      modal_search_countries: "Rechercher un pays ou une région...",
      modal_btn_save: "Appliquer les préférences",
      ai_launcher_title: "Demander à Eduvia",
      ai_launcher_sub: "Assistant IA d'orientation",
      ai_header_subtitle: "Votre assistant pour trouver le programme idéal",
      ai_input_placeholder: "Renseignez-vous sur les programmes, frais, conditions...",
      ai_disclaimer: "Données certifiées • Toujours vérifier auprès des universités."
    },
    de: {
      nav_home: "Startseite",
      nav_explore: "Entdecken",
      nav_programmes: "Studiengänge",
      nav_universities: "Universitäten",
      nav_compare: "Vergleichen",
      nav_discover: "Orientierung",
      nav_resources: "Ressourcen",
      nav_shortlist: "Merkliste",
      nav_login: "Anmelden",
      nav_get_started: "Jetzt starten",
      topbar_ugc: "Staatlich anerkannte Studiengänge & Universitäten",
      topbar_counseling: "Studienberatungs-Hotline",
      search_placeholder: "Studiengänge, Universitäten oder Fachbereiche suchen...",
      filter_programmes: "Studiengänge filtern",
      filter_destination: "Studienland / Ziel",
      filter_all_countries: "Alle Länder",
      filter_level: "Abschlussgrad",
      filter_discipline: "Fachbereich",
      filter_university: "Universität",
      filter_mode: "Studienmodell",
      filter_fees: "Gesamte Studiengebühren",
      filter_duration: "Dauer",
      filter_clear_all: "Alle Filter zurücksetzen",
      btn_view_programme: "Studiengang ansehen",
      btn_view_university: "Universität ansehen",
      btn_compare: "Vergleichen",
      btn_shortlist: "Merken",
      btn_saved: "Gespeichert",
      btn_apply_now: "Jetzt bewerben",
      btn_calculate_emi: "Monatsrate berechnen",
      label_total_fee: "Gesamte Studiengebühr",
      label_approx_monthly: "Ca. monatlich",
      label_original_fee: "Veröffentlichte Originalgebühr",
      label_approx_converted: "Umgerechneter Richtwert",
      label_eligibility: "Zulassungsvoraussetzungen",
      label_duration: "Regelstudienzeit",
      label_accreditation: "Akkreditierung",
      label_study_mode: "Studienform",
      label_specialisation: "Schwerpunkt",
      modal_pref_title: "Regionale Einstellungen & Sprache",
      modal_tab_destination: "Studienland",
      modal_tab_language: "Sprache",
      modal_tab_currency: "Währung",
      modal_search_countries: "Land oder Region suchen...",
      modal_btn_save: "Einstellungen übernehmen",
      ai_launcher_title: "Eduvia fragen",
      ai_launcher_sub: "KI-Studienberater",
      ai_header_subtitle: "Ihr digitaler Assistent zur Studienorientierung",
      ai_input_placeholder: "Fragen zu Studiengängen, Gebühren, Zulassung...",
      ai_disclaimer: "Geprüfte Datensätze • Bitte Details direkt bei Universitäten verifizieren."
    },
    es: {
      nav_home: "Inicio",
      nav_explore: "Explorar",
      nav_programmes: "Programas",
      nav_universities: "Universidades",
      nav_compare: "Comparar",
      nav_discover: "Descubrir",
      nav_resources: "Recursos",
      nav_shortlist: "Favoritos",
      nav_login: "Iniciar sesión",
      nav_get_started: "Comenzar",
      topbar_ugc: "Títulos y universidades acreditados oficialmente",
      topbar_counseling: "Línea de asesoramiento académico",
      search_placeholder: "Buscar programas, universidades o especializaciones...",
      filter_programmes: "Filtrar programas",
      filter_destination: "Destino de estudio / País",
      filter_all_countries: "Todos los países",
      filter_level: "Nivel de grado",
      filter_discipline: "Campo / Disciplina",
      filter_university: "Universidad",
      filter_mode: "Modalidad de estudio",
      filter_fees: "Matrícula total",
      filter_duration: "Duración",
      filter_clear_all: "Borrar filtros",
      btn_view_programme: "Ver programa",
      btn_view_university: "Ver universidad",
      btn_compare: "Comparar",
      btn_shortlist: "Guardar",
      btn_saved: "Guardado",
      btn_apply_now: "Solicitar admisión",
      btn_calculate_emi: "Calcular cuota mensual",
      label_total_fee: "Tarifa total del curso",
      label_approx_monthly: "Aprox. mensual",
      label_original_fee: "Tarifa original publicada",
      label_approx_converted: "Valor convertido estimado",
      label_eligibility: "Requisitos de admisión",
      label_duration: "Duración",
      label_accreditation: "Acreditación",
      label_study_mode: "Modalidad",
      label_specialisation: "Especialización",
      modal_pref_title: "Preferencias regionales y de idioma",
      modal_tab_destination: "País de estudio",
      modal_tab_language: "Idioma",
      modal_tab_currency: "Moneda",
      modal_search_countries: "Buscar país o región...",
      modal_btn_save: "Aplicar preferencias",
      ai_launcher_title: "Preguntar a Eduvia",
      ai_launcher_sub: "Asistente IA de programas",
      ai_header_subtitle: "Tu asistente para descubrir programas universitarios",
      ai_input_placeholder: "Pregunta sobre carreras, tarifas, requisitos...",
      ai_disclaimer: "Datos certificados • Verificar siempre con la universidad."
    }
  },

  // --------------------------------------------------------------------------
  // 5. INITIALIZATION & STORAGE LIFECYCLE
  // --------------------------------------------------------------------------
  init() {
    this.loadPreferences();
    this.applyDirection();
    this.translatePage();
    this.injectPreferencesModal();
    this.bindHeaderTriggers();
    this.updateHeaderTriggerUI();
  },

  loadPreferences() {
    try {
      const savedCountry = localStorage.getItem(this.STORAGE_KEYS.COUNTRY);
      const savedLang = localStorage.getItem(this.STORAGE_KEYS.LANGUAGE);
      const savedCurr = localStorage.getItem(this.STORAGE_KEYS.CURRENCY);

      if (savedCountry && this.getCountry(savedCountry)) {
        this.activeCountry = savedCountry;
      } else {
        this.activeCountry = "IN";
      }

      if (savedLang && this.getLanguage(savedLang)) {
        this.activeLanguage = savedLang;
      } else {
        this.activeLanguage = "en";
      }

      if (savedCurr && this.getCurrency(savedCurr)) {
        this.activeCurrency = savedCurr;
      } else {
        this.activeCurrency = "INR";
      }
    } catch (e) {
      console.warn("EduviaI18n: Corrupted storage, falling back to defaults", e);
      this.activeCountry = "IN";
      this.activeLanguage = "en";
      this.activeCurrency = "INR";
    }
  },

  savePreferences() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.COUNTRY, this.activeCountry);
      localStorage.setItem(this.STORAGE_KEYS.LANGUAGE, this.activeLanguage);
      localStorage.setItem(this.STORAGE_KEYS.CURRENCY, this.activeCurrency);
    } catch (e) {
      console.warn("EduviaI18n: Could not persist preferences to localStorage", e);
    }
  },

  // --------------------------------------------------------------------------
  // 6. STATE MUTATORS
  // --------------------------------------------------------------------------
  setCountry(code, updateCurrency = true) {
    const c = this.getCountry(code);
    if (!c) return;

    this.activeCountry = c.code;

    // Suggest default currency of country if requested
    if (updateCurrency && c.defaultCurrency) {
      this.setCurrency(c.defaultCurrency, false);
    }

    this.savePreferences();
    this.updateHeaderTriggerUI();
    this.notifySubscribers("country_change", this.activeCountry);
  },

  setLanguage(code) {
    const l = this.getLanguage(code);
    if (!l) return;

    this.activeLanguage = l.code;
    this.savePreferences();
    this.applyDirection();
    this.translatePage();
    this.updateHeaderTriggerUI();
    this.notifySubscribers("language_change", this.activeLanguage);
  },

  setCurrency(code, save = true) {
    const curr = this.getCurrency(code);
    if (!curr) return;

    this.activeCurrency = curr.code;
    if (save) this.savePreferences();
    this.updateHeaderTriggerUI();
    this.notifySubscribers("currency_change", this.activeCurrency);
  },

  applyDirection() {
    const l = this.getLanguage(this.activeLanguage);
    const dir = l ? l.dir : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = this.activeLanguage;

    if (dir === "rtl") {
      document.body.classList.add("eduvia-rtl");
    } else {
      document.body.classList.remove("eduvia-rtl");
    }
  },

  // --------------------------------------------------------------------------
  // 7. TRANSLATION & DOM BINDINGS
  // --------------------------------------------------------------------------
  t(key, fallback = "") {
    const dict = this.translations[this.activeLanguage] || this.translations.en;
    if (dict && dict[key]) return dict[key];
    const enDict = this.translations.en;
    return (enDict && enDict[key]) ? enDict[key] : (fallback || key);
  },

  translatePage() {
    // 1. Text elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        el.textContent = this.t(key, el.textContent);
      }
    });

    // 2. Input Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) {
        el.setAttribute("placeholder", this.t(key, el.getAttribute("placeholder") || ""));
      }
    });

    // 3. Aria Labels
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) {
        el.setAttribute("aria-label", this.t(key, el.getAttribute("aria-label") || ""));
      }
    });

    // 4. Titles
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      if (key) {
        el.setAttribute("title", this.t(key, el.getAttribute("title") || ""));
      }
    });
  },

  // --------------------------------------------------------------------------
  // 8. CURRENCY FORMATTING & CONVERSION ENGINE
  // --------------------------------------------------------------------------
  getCountry(code) {
    return this.countries.find(c => c.code.toUpperCase() === (code || "").toUpperCase()) || null;
  },

  getLanguage(code) {
    return this.languages.find(l => l.code.toLowerCase() === (code || "").toLowerCase()) || null;
  },

  getCurrency(code) {
    return this.currencies.find(c => c.code.toUpperCase() === (code || "").toUpperCase()) || null;
  },

  formatCurrency(amount, currencyCode = this.activeCurrency) {
    const curr = this.getCurrency(currencyCode) || this.currencies[0];
    const numeric = typeof amount === "number" ? amount : parseFloat(amount) || 0;

    try {
      return new Intl.NumberFormat(curr.locale || "en-IN", {
        style: "currency",
        currency: curr.code,
        maximumFractionDigits: 0
      }).format(numeric);
    } catch (e) {
      return `${curr.symbol}${numeric.toLocaleString()}`;
    }
  },

  /**
   * Convert an amount published in INR to target display currency.
   * Retains published source of truth and returns formatted string objects.
   */
  convertPrice(inrAmount, targetCurrencyCode = this.activeCurrency) {
    const numericINR = typeof inrAmount === "number" ? inrAmount : parseFloat(inrAmount) || 0;
    const targetCurr = this.getCurrency(targetCurrencyCode) || this.getCurrency("INR");
    const isOriginal = targetCurr.code === "INR";

    let convertedAmount = numericINR;
    if (!isOriginal && targetCurr.rateToINR > 0) {
      convertedAmount = Math.round(numericINR / targetCurr.rateToINR);
    }

    const formattedConverted = this.formatCurrency(convertedAmount, targetCurr.code);
    const formattedOriginal = this.formatCurrency(numericINR, "INR");

    return {
      amount: convertedAmount,
      currency: targetCurr.code,
      symbol: targetCurr.symbol,
      formatted: formattedConverted,
      isConverted: !isOriginal,
      originalAmount: numericINR,
      originalCurrency: "INR",
      originalFormatted: formattedOriginal,
      badgeText: isOriginal ? "" : `Approx. in ${targetCurr.code} (Orig: ${formattedOriginal})`
    };
  },

  /**
   * Parse amounts & currencies out of natural text strings
   * Handles "$10,000", "10k usd", "₹5 lakh", "500000 inr", "aed 30000", "€12000"
   */
  parseCurrencyFromText(text) {
    if (!text) return null;
    const str = text.toLowerCase().trim();

    // Check for explicit currency tokens
    let detectedCurrency = this.activeCurrency;
    if (str.includes("$") || str.includes("usd") || str.includes("dollar")) detectedCurrency = "USD";
    else if (str.includes("ca$") || str.includes("cad")) detectedCurrency = "CAD";
    else if (str.includes("£") || str.includes("gbp") || str.includes("pound")) detectedCurrency = "GBP";
    else if (str.includes("€") || str.includes("eur") || str.includes("euro")) detectedCurrency = "EUR";
    else if (str.includes("a$") || str.includes("aud")) detectedCurrency = "AUD";
    else if (str.includes("aed") || str.includes("dirham") || str.includes("د.إ")) detectedCurrency = "AED";
    else if (str.includes("sar") || str.includes("riyal") || str.includes("﷼")) detectedCurrency = "SAR";
    else if (str.includes("qar")) detectedCurrency = "QAR";
    else if (str.includes("omr")) detectedCurrency = "OMR";
    else if (str.includes("sgd")) detectedCurrency = "SGD";
    else if (str.includes("myr") || str.includes("rm")) detectedCurrency = "MYR";
    else if (str.includes("₹") || str.includes("inr") || str.includes("rs") || str.includes("rupee") || str.includes("lakh")) detectedCurrency = "INR";

    // Extract numerical value + scale multipliers (lakh, k, thousand, m, million)
    const match = str.match(/([0-9.,]+)\s*(lakh|lac|k|thousand|million|m)?/i);
    if (!match) return null;

    let val = parseFloat(match[1].replace(/,/g, ""));
    if (isNaN(val)) return null;

    const unit = (match[2] || "").toLowerCase();
    if (unit.startsWith("l")) val = val * 100000;
    else if (unit.startsWith("k") || unit.startsWith("thous")) val = val * 1000;
    else if (unit.startsWith("m")) val = val * 1000000;

    // Convert value to Base INR for uniform comparison
    const currObj = this.getCurrency(detectedCurrency);
    const inrEquivalent = currObj ? Math.round(val * currObj.rateToINR) : val;

    return {
      rawAmount: val,
      currency: detectedCurrency,
      inrEquivalent: inrEquivalent,
      formatted: this.formatCurrency(val, detectedCurrency)
    };
  },

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 9. HEADER & MOBILE TRIGGER UI LOCKUP
  // --------------------------------------------------------------------------
  updateHeaderTriggerUI() {
    const country = this.getCountry(this.activeCountry) || this.countries[0];
    const lang = this.getLanguage(this.activeLanguage) || this.languages[0];
    const curr = this.getCurrency(this.activeCurrency) || this.currencies[0];

    // Find all triggers across topbar & mobile menus
    const triggers = document.querySelectorAll(".eduvia-i18n-trigger, #topbar-i18n-btn, #header-i18n-trigger");
    triggers.forEach(trig => {
      trig.setAttribute("aria-label", `Preferences: ${country.name}, ${lang.name}, ${curr.code}`);
      if (trig.classList.contains("mobile-drawer-i18n-btn")) {
        trig.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">public</span>
            <span>Region &amp; Language</span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="i18n-label font-bold text-secondary">${country.code}</span>
            <span class="i18n-sep opacity-50">/</span>
            <span class="i18n-label uppercase">${lang.code}</span>
            <span class="i18n-sep opacity-50">•</span>
            <span class="i18n-label font-medium">${curr.code}</span>
            <span class="material-symbols-outlined text-[16px] text-muted ml-1">tune</span>
          </div>
        `;
      } else {
        trig.innerHTML = `
          <span class="material-symbols-outlined text-[14px]">public</span>
          <span class="i18n-label font-bold">${country.code}</span>
          <span class="i18n-sep text-outline-variant">/</span>
          <span class="i18n-label uppercase">${lang.code}</span>
          <span class="i18n-sep text-outline-variant">•</span>
          <span class="i18n-label font-medium">${curr.code}</span>
        `;
      }
    });
  },

  bindHeaderTriggers() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".eduvia-i18n-trigger, #topbar-i18n-btn, #header-i18n-trigger, [data-open-i18n]");
      if (btn) {
        e.preventDefault();
        this.openModal();
      }
    });
  },

  // --------------------------------------------------------------------------
  // 10. SEARCHABLE REGIONAL PREFERENCES MODAL
  // --------------------------------------------------------------------------
  injectPreferencesModal() {
    if (document.getElementById("eduvia-i18n-modal")) return;

    const modal = document.createElement("div");
    modal.id = "eduvia-i18n-modal";
    modal.className = "eduvia-i18n-modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "eduvia-i18n-modal-title");

    modal.innerHTML = `
      <div class="eduvia-i18n-modal-dialog">
        <!-- Modal Header -->
        <div class="eduvia-i18n-modal-header">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">public</span>
            <h3 class="eduvia-i18n-modal-title" id="eduvia-i18n-modal-title" data-i18n="modal_pref_title">
              Regional & Language Preferences
            </h3>
          </div>
          <button type="button" class="eduvia-i18n-modal-close" onclick="EduviaI18n.closeModal()" aria-label="Close preferences">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="eduvia-i18n-tabs-nav" role="tablist">
          <button type="button" class="eduvia-i18n-tab-btn active" data-tab="tab-destination" role="tab" aria-selected="true" onclick="EduviaI18n.switchTab('tab-destination')">
            <span class="material-symbols-outlined tab-icon text-[18px]">public</span>
            <span data-i18n="modal_tab_destination">Study Destination</span>
          </button>
          <button type="button" class="eduvia-i18n-tab-btn" data-tab="tab-language" role="tab" aria-selected="false" onclick="EduviaI18n.switchTab('tab-language')">
            <span class="material-symbols-outlined tab-icon text-[18px]">translate</span>
            <span data-i18n="modal_tab_language">Language</span>
          </button>
          <button type="button" class="eduvia-i18n-tab-btn" data-tab="tab-currency" role="tab" aria-selected="false" onclick="EduviaI18n.switchTab('tab-currency')">
            <span class="material-symbols-outlined tab-icon text-[18px]">payments</span>
            <span data-i18n="modal_tab_currency">Currency</span>
          </button>
        </div>

        <!-- Tab 1: Country / Study Destination -->
        <div class="eduvia-i18n-tab-pane active" id="tab-destination" role="tabpanel">
          <div class="eduvia-i18n-search-box">
            <span class="material-symbols-outlined search-ico">search</span>
            <input 
              type="text" 
              id="i18n-country-search-input" 
              placeholder="Search country or region (e.g. Canada, UAE, UK)..." 
              data-i18n-placeholder="modal_search_countries"
              oninput="EduviaI18n.filterCountries(this.value)"
              autocomplete="off"
            />
          </div>
          <div class="eduvia-i18n-countries-grid" id="i18n-countries-list"></div>
        </div>

        <!-- Tab 2: Language -->
        <div class="eduvia-i18n-tab-pane" id="tab-language" role="tabpanel">
          <p class="text-xs text-on-surface-variant mb-3">
            Select your preferred interface language. Course titles and official institutional names remain unaltered.
          </p>
          <div class="eduvia-i18n-languages-grid" id="i18n-languages-list"></div>
        </div>

        <!-- Tab 3: Currency -->
        <div class="eduvia-i18n-tab-pane" id="tab-currency" role="tabpanel">
          <p class="text-xs text-on-surface-variant mb-3">
            Published university tuition is held in base INR. Display currencies show transparent approximate conversions.
          </p>
          <div class="eduvia-i18n-currencies-grid" id="i18n-currencies-list"></div>
        </div>

        <!-- Modal Footer -->
        <div class="eduvia-i18n-modal-footer">
          <div class="eduvia-i18n-summary-pill" id="i18n-active-summary">
            <!-- Dynamic selection pill -->
          </div>
          <button type="button" class="btn btn-primary btn-sm" onclick="EduviaI18n.saveAndApplyModal()" data-i18n="modal_btn_save">
            Apply Preferences
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Keyboard support: Escape closes modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        this.closeModal();
      }
    });

    // Click outside dialog closes modal
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });
  },

  openModal() {
    const modal = document.getElementById("eduvia-i18n-modal");
    if (!modal) {
      this.injectPreferencesModal();
    }
    const m = document.getElementById("eduvia-i18n-modal");
    if (m) {
      this.renderCountriesGrid();
      this.renderLanguagesGrid();
      this.renderCurrenciesGrid();
      this.updateModalSummary();
      m.classList.add("open");
      document.body.style.overflow = "hidden";

      // Focus search input
      const searchInput = document.getElementById("i18n-country-search-input");
      if (searchInput) setTimeout(() => searchInput.focus(), 150);
    }
  },

  closeModal() {
    const m = document.getElementById("eduvia-i18n-modal");
    if (m) {
      m.classList.remove("open");
      document.body.style.overflow = "";
    }
  },

  switchTab(tabId) {
    document.querySelectorAll(".eduvia-i18n-tab-btn").forEach(btn => {
      const isActive = btn.getAttribute("data-tab") === tabId;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    document.querySelectorAll(".eduvia-i18n-tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === tabId);
    });
  },

  renderCountriesGrid(filterQuery = "") {
    const container = document.getElementById("i18n-countries-list");
    if (!container) return;

    const q = filterQuery.toLowerCase().trim();
    const regions = ["South Asia", "Middle East", "North America", "Europe", "Oceania", "Southeast Asia", "Africa"];

    let html = "";
    regions.forEach(reg => {
      const regCountries = this.countries.filter(c => c.region === reg && (
        !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.nativeName.toLowerCase().includes(q)
      ));

      if (regCountries.length > 0) {
        html += `
          <div class="eduvia-i18n-region-block">
            <h5 class="eduvia-i18n-region-title">${reg}</h5>
            <div class="eduvia-i18n-region-grid">
              ${regCountries.map(c => {
                const isSelected = c.code === this.activeCountry;
                return `
                  <button type="button" class="eduvia-i18n-country-card ${isSelected ? 'selected' : ''}" onclick="EduviaI18n.selectCountryInModal('${c.code}')">
                    <span class="c-code-badge">${c.code}</span>
                    <div class="c-meta">
                      <span class="c-name">${c.name}</span>
                      <span class="c-sub">${c.nativeName} • ${c.defaultCurrency}</span>
                    </div>
                    ${isSelected ? '<span class="material-symbols-outlined check-ico">check_circle</span>' : ''}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }
    });

    if (!html) {
      container.innerHTML = `
        <div class="text-center py-8 text-on-surface-variant text-sm">
          No countries found matching "${filterQuery}". Try searching by country name or code.
        </div>
      `;
    } else {
      container.innerHTML = html;
    }
  },

  filterCountries(query) {
    this.renderCountriesGrid(query);
  },

  renderLanguagesGrid() {
    const container = document.getElementById("i18n-languages-list");
    if (!container) return;

    container.innerHTML = `
      <div class="eduvia-i18n-langs-flow">
        ${this.languages.map(l => {
          const isSelected = l.code === this.activeLanguage;
          return `
            <button type="button" class="eduvia-i18n-lang-chip ${isSelected ? 'selected' : ''}" onclick="EduviaI18n.selectLanguageInModal('${l.code}')">
              <span class="l-native">${l.nativeName}</span>
              <span class="l-eng">${l.name} ${l.dir === 'rtl' ? '(RTL)' : ''}</span>
              ${isSelected ? '<span class="material-symbols-outlined check-ico">check</span>' : ''}
            </button>
          `;
        }).join("")}
      </div>
    `;
  },

  renderCurrenciesGrid() {
    const container = document.getElementById("i18n-currencies-list");
    if (!container) return;

    container.innerHTML = `
      <div class="eduvia-i18n-curr-grid">
        ${this.currencies.map(curr => {
          const isSelected = curr.code === this.activeCurrency;
          const sampleConversion = this.convertPrice(150000, curr.code);
          return `
            <button type="button" class="eduvia-i18n-curr-card ${isSelected ? 'selected' : ''}" onclick="EduviaI18n.selectCurrencyInModal('${curr.code}')">
              <div class="curr-top">
                <span class="curr-sym">${curr.symbol}</span>
                <span class="curr-code font-bold">${curr.code}</span>
              </div>
              <div class="curr-name">${curr.name}</div>
              <div class="curr-sample text-xs text-on-surface-variant mt-1">₹1.5L ≈ ${sampleConversion.formatted}</div>
              ${isSelected ? '<span class="material-symbols-outlined check-ico">check_circle</span>' : ''}
            </button>
          `;
        }).join("")}
      </div>
    `;
  },

  selectCountryInModal(code) {
    const c = this.getCountry(code);
    if (!c) return;

    this.activeCountry = c.code;
    if (c.defaultCurrency) {
      this.activeCurrency = c.defaultCurrency;
    }
    this.renderCountriesGrid();
    this.renderCurrenciesGrid();
    this.updateModalSummary();
  },

  selectLanguageInModal(code) {
    this.activeLanguage = code;
    this.renderLanguagesGrid();
    this.updateModalSummary();
  },

  selectCurrencyInModal(code) {
    this.activeCurrency = code;
    this.renderCurrenciesGrid();
    this.updateModalSummary();
  },

  updateModalSummary() {
    const container = document.getElementById("i18n-active-summary");
    if (!container) return;

    const c = this.getCountry(this.activeCountry) || this.countries[0];
    const l = this.getLanguage(this.activeLanguage) || this.languages[0];
    const curr = this.getCurrency(this.activeCurrency) || this.currencies[0];

    container.innerHTML = `
      <span><span class="font-mono text-xs text-primary font-bold">${c.code}</span> <strong>${c.name}</strong></span>
      <span>•</span>
      <span><strong>${l.nativeName}</strong> (${l.name})</span>
      <span>•</span>
      <span><strong>${curr.code}</strong> (${curr.symbol})</span>
    `;
  },

  saveAndApplyModal() {
    this.savePreferences();
    this.applyDirection();
    this.translatePage();
    this.updateHeaderTriggerUI();
    this.closeModal();

    // Trigger page-level re-renders (filters, cards, detail pages, compare matrix)
    if (typeof EduviaFilters !== "undefined" && typeof EduviaFilters.applyFilters === "function") {
      EduviaFilters.applyFilters(false);
    }
    if (typeof EduviaApp !== "undefined" && typeof EduviaApp.initHomepage === "function") {
      EduviaApp.initHomepage();
    }
    if (typeof EduviaUI !== "undefined" && typeof EduviaUI.showToast === "function") {
      const c = this.getCountry(this.activeCountry);
      EduviaUI.showToast(`Preferences updated: ${c.name} • ${this.activeLanguage.toUpperCase()} • ${this.activeCurrency}`);
    }

    this.notifySubscribers("preferences_applied", {
      country: this.activeCountry,
      language: this.activeLanguage,
      currency: this.activeCurrency
    });
  },

  // --------------------------------------------------------------------------
  // 11. EVENT BUS & SUBSCRIBERS
  // --------------------------------------------------------------------------
  subscribers: [],

  subscribe(callback) {
    if (typeof callback === "function") {
      this.subscribers.push(callback);
    }
  },

  notifySubscribers(eventType, data) {
    this.subscribers.forEach(cb => {
      try {
        cb(eventType, data);
      } catch (e) {
        console.warn("EduviaI18n Subscriber Error:", e);
      }
    });
  }
};

// Auto-boot on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => EduviaI18n.init());
  } else {
    EduviaI18n.init();
  }
}

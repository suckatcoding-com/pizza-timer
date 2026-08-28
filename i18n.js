// i18n.js

const translations = {
    en: {
        title: "🍕 Pizza Timer",
        subtitle: "Your flexible dough schedule",
        calc_title: "Ingredients Calculator",
        label_pizzas: "Pizzas (pcs)",
        label_size: "Pizza size",
        size_custom: "Custom",
        size_100: "Small 20 cm – 100 g",
        size_150: "Mini 25 cm – 150 g",
        size_200: "Medium 28 cm – 200 g",
        size_250: "Large 30 cm – 250 g",
        size_300: "XL 33 cm – 300 g",
        size_350: "XXL 35 cm – 350 g",
        size_400: "Party 40 cm – 400 g",
        label_weight: "Weight/pc (g)",
        label_hydration: "Water (%)",
        label_salt: "Salt (%)",
        label_yeast: "Yeast Type",
        yeast_fresh: "Fresh Yeast",
        yeast_dry: "Active Dry Yeast",
        yeast_instant: "Instant Yeast",
        schedule_title: "Schedule",
        label_baketime: "Approx. meal time (Start):",
        label_method: "Dough Method",
        method_24: "Standard (24h - Neapolitan)",
        method_8: "Quick (8h - Room Temp)",
        method_48: "Pro (48h - Cold Fermentation)",
        task1_title: "Knead dough",
        task1_desc: "Mix and knead ingredients. Then cover and let rest at room temperature (bulk fermentation).",
        task2_title: "Into the fridge",
        task2_desc: "Seal dough airtight and place in the fridge for cold fermentation.",
        task3_title: "Shape dough balls",
        task3_desc: "Portion dough, shape into balls, cover and let rise at room temperature (proof).",
        task4_title: "Turn on oven & Bake",
        task4_desc: "Time to preheat the oven and bake the pizzas! Enjoy your meal.",
        flour: "Flour (Type 00)",
        water_cold: "Water (cold)",
        salt: "Salt",
        total_dough: "Total dough",
        time_separator: " - ",
        cal_title: "Add to calendar"
    },
    de: {
        title: "🍕 Pizza Timer",
        subtitle: "Dein flexibler Teig-Fahrplan",
        calc_title: "Zutaten-Rechner",
        label_pizzas: "Pizzen (Stk.)",
        label_size: "Pizzagröße",
        size_custom: "Eigene",
        size_100: "Klein 20 cm – 100 g",
        size_150: "Mini 25 cm – 150 g",
        size_200: "Mittel 28 cm – 200 g",
        size_250: "Groß 30 cm – 250 g",
        size_300: "XL 33 cm – 300 g",
        size_350: "XXL 35 cm – 350 g",
        size_400: "Party 40 cm – 400 g",
        label_weight: "Gewicht/Stk (g)",
        label_hydration: "Wasser (%)",
        label_salt: "Salz (%)",
        label_yeast: "Hefe-Typ",
        yeast_fresh: "Frischhefe",
        yeast_dry: "Trockenhefe (Active Dry)",
        yeast_instant: "Instant-Hefe",
        schedule_title: "Zeitplan",
        label_baketime: "Ungefähre Essenszeit (Start):",
        label_method: "Teig-Methode",
        method_24: "Standard (24h - Neapolitanisch)",
        method_8: "Schnell (8h - Raumtemperatur)",
        method_48: "Profi (48h - Kalte Gare)",
        task1_title: "Teig kneten",
        task1_desc: "Zutaten vermengen und kneten. Anschließend abgedeckt bei Raumtemperatur ruhen lassen (Stockgare).",
        task2_title: "Ab in den Kühlschrank",
        task2_desc: "Teig luftdicht verschließen und für die kalte Gare in den Kühlschrank stellen.",
        task3_title: "Teiglinge formen",
        task3_desc: "Teig portionieren, zu Kugeln formen und abgedeckt bei Raumtemperatur gehen lassen (Stückgare).",
        task4_title: "Ofen an & Backen",
        task4_desc: "Zeit, den Ofen vorzuheizen und die Pizzen zu backen! Guten Appetit.",
        flour: "Mehl (Typ 00)",
        water_cold: "Wasser (kalt)",
        salt: "Salz",
        total_dough: "Gesamtteig",
        time_separator: " - ",
        time_suffix: " Uhr",
        cal_title: "In Kalender eintragen"
    }
};

// Spracheinstellungen ermitteln
let currentLang = 'en'; // Fallback
const browserLang = navigator.language || navigator.userLanguage;
if (browserLang.toLowerCase().startsWith('de')) {
    currentLang = 'de';
}
document.documentElement.lang = currentLang;

// Hilfsfunktion für Übersetzungen
function t(key) {
    return translations[currentLang][key] || key;
}

// DOM Texte übersetzen
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (translations[currentLang][key]) {
            el.title = translations[currentLang][key];
        }
    });
}
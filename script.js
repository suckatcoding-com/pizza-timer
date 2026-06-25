if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Setup fehlgeschlagen:', err));
    });
}

// --- DOM Elements ---
const numPizzasInput = document.getElementById('num-pizzas');
const weightPizzaInput = document.getElementById('weight-pizza');
const hydrationInput = document.getElementById('hydration');
const saltInput = document.getElementById('salt');
const yeastTypeInput = document.getElementById('yeast-type');
const recipeResult = document.getElementById('recipe-result');
const bakeTimeInput = document.getElementById('bake-time');
const recipeTypeInput = document.getElementById('recipe-type');
const timeline = document.getElementById('timeline');
const stepFridge = document.getElementById('step-fridge');

// --- Load saved values from localStorage ---
const savedBakeTime = localStorage.getItem('pizza-bake-time');
const savedRecipeType = localStorage.getItem('pizza-recipe-type');

if (localStorage.getItem('pizza-num')) numPizzasInput.value = localStorage.getItem('pizza-num');
if (localStorage.getItem('pizza-weight')) weightPizzaInput.value = localStorage.getItem('pizza-weight');
if (localStorage.getItem('pizza-hydration')) hydrationInput.value = localStorage.getItem('pizza-hydration');
if (localStorage.getItem('pizza-salt')) saltInput.value = localStorage.getItem('pizza-salt');
if (localStorage.getItem('pizza-yeast-type')) yeastTypeInput.value = localStorage.getItem('pizza-yeast-type');

if (savedRecipeType) {
    recipeTypeInput.value = savedRecipeType;
}

if (savedBakeTime) {
    bakeTimeInput.value = savedBakeTime;
} else {
    const now = new Date();
    now.setHours(19, 0, 0, 0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
    bakeTimeInput.value = localISOTime;
}

function formatTimeWindow(dateStart, dateEnd) {
    const locale = browserLang;
    const optionsDay = { weekday: 'short' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    const dayStr = new Intl.DateTimeFormat(locale, optionsDay).format(dateStart);
    const timeStart = new Intl.DateTimeFormat(locale, optionsTime).format(dateStart);
    const timeEnd = new Intl.DateTimeFormat(locale, optionsTime).format(dateEnd);
    const suffix = currentLang === 'de' ? ' Uhr' : '';

    if (dateStart.getDate() === dateEnd.getDate()) {
        return `${dayStr}, ${timeStart} - ${timeEnd}${suffix}`;
    } else {
        const endDayStr = new Intl.DateTimeFormat(locale, optionsDay).format(dateEnd);
        return `${dayStr} ${timeStart} - ${endDayStr} ${timeEnd}`;
    }
}

function downloadICS(title, description, startDate, endDate) {
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Pizza Timer//' + currentLang.toUpperCase(),
        'BEGIN:VEVENT',
        `UID:${Date.now()}@pizzatimer`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:🍕 Pizza: ${title}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Pizza_${title.replace(/ /g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- Ingredients ---
function updateIngredients() {
    const pizzas = parseInt(numPizzasInput.value) || 4;
    const weight = parseInt(weightPizzaInput.value) || 250;
    const hydration = parseFloat(hydrationInput.value) || 65;
    const salt = parseFloat(saltInput.value) || 3;
    const hoursTotal = parseInt(recipeTypeInput.value) || 24;
    const yeastType = yeastTypeInput.value;

    let baseYeastPercent = 0.2;
    if (hoursTotal === 8) baseYeastPercent = 0.15;
    if (hoursTotal === 24) baseYeastPercent = 0.35;
    if (hoursTotal === 48) baseYeastPercent = 0.2;

    let actualYeastPercent = baseYeastPercent;
    let yeastName = t('yeast_fresh');

    if (yeastType === "dry") {
        actualYeastPercent = baseYeastPercent * 0.40;
        yeastName = t('yeast_dry');
    } else if (yeastType === "instant") {
        actualYeastPercent = baseYeastPercent * 0.33;
        yeastName = t('yeast_instant');
    }

    const totalWeight = pizzas * weight;
    const totalPercent = 100 + hydration + salt + actualYeastPercent;

    const flour = totalWeight / (totalPercent / 100);
    const water = flour * (hydration / 100);
    const saltAmount = flour * (salt / 100);
    const yeastAmount = flour * (actualYeastPercent / 100);

    recipeResult.innerHTML = `
                <div class="ingr-row"><strong>${t('flour')}</strong> <span>${Math.round(flour)} g</span></div>
                <div class="ingr-row"><strong>${t('water_cold')}</strong> <span>${Math.round(water)} g</span></div>
                <div class="ingr-row"><strong>${t('salt')}</strong> <span>${saltAmount.toFixed(1)} g</span></div>
                <div class="ingr-row"><strong>${yeastName}</strong> <span>${yeastAmount.toFixed(2)} g</span></div>
                <div class="ingr-total">${t('total_dough')}: ${totalWeight} g</div>
            `;

    localStorage.setItem('pizza-num', pizzas);
    localStorage.setItem('pizza-weight', weight);
    localStorage.setItem('pizza-hydration', hydration);
    localStorage.setItem('pizza-salt', salt);
    localStorage.setItem('pizza-yeast-type', yeastType);
}

// --- Timeline ---
function updateTimeline() {
    const bakeTime = new Date(bakeTimeInput.value);
    const hoursTotal = parseInt(recipeTypeInput.value);
    const suffix = currentLang === 'de' ? ' Uhr' : '';

    if (isNaN(bakeTime.getTime())) return;

    localStorage.setItem('pizza-bake-time', bakeTimeInput.value);
    localStorage.setItem('pizza-recipe-type', recipeTypeInput.value);

    const exactBakeStr = new Intl.DateTimeFormat(browserLang, {
        weekday: 'short', hour: '2-digit', minute: '2-digit'
    }).format(bakeTime);

    document.getElementById('time-4').innerText = `${exactBakeStr}${suffix}`;
    const bakeEnd = new Date(bakeTime.getTime() + (2 * 60 * 60 * 1000));
    document.getElementById('cal-4').onclick = () => downloadICS(t('task4_title'), t('task4_desc'), bakeTime, bakeEnd);

    const formStart = new Date(bakeTime.getTime() - (6 * 60 * 60 * 1000));
    const formEnd = new Date(bakeTime.getTime() - (4 * 60 * 60 * 1000));
    document.getElementById('time-3').innerText = formatTimeWindow(formStart, formEnd);
    document.getElementById('cal-3').onclick = () => downloadICS(t('task3_title'), t('task3_desc'), formStart, formEnd);

    const targetStart = new Date(bakeTime.getTime() - (hoursTotal * 60 * 60 * 1000));
    const kneadStart = new Date(targetStart.getTime() - (1 * 60 * 60 * 1000));
    const kneadEnd = new Date(targetStart.getTime() + (1 * 60 * 60 * 1000));
    document.getElementById('time-1').innerText = formatTimeWindow(kneadStart, kneadEnd);
    document.getElementById('cal-1').onclick = () => downloadICS(t('task1_title'), t('task1_desc'), kneadStart, kneadEnd);

    if (hoursTotal > 8) {
        stepFridge.style.display = 'block';
        const fridgeStart = new Date(targetStart.getTime() + (1 * 60 * 60 * 1000));
        const fridgeEnd = new Date(targetStart.getTime() + (4 * 60 * 60 * 1000));
        document.getElementById('time-2').innerText = formatTimeWindow(fridgeStart, fridgeEnd);
        document.getElementById('cal-2').onclick = () => downloadICS(t('task2_title'), t('task2_desc'), fridgeStart, fridgeEnd);
    } else {
        stepFridge.style.display = 'none';
    }

    timeline.classList.add('active');
}

// --- Event Listener ---
bakeTimeInput.addEventListener('change', updateTimeline);
recipeTypeInput.addEventListener('change', () => {
    updateTimeline();
    updateIngredients();
});

numPizzasInput.addEventListener('input', updateIngredients);
weightPizzaInput.addEventListener('input', updateIngredients);
hydrationInput.addEventListener('input', updateIngredients);
saltInput.addEventListener('input', updateIngredients);
yeastTypeInput.addEventListener('change', updateIngredients);

// --- Init ---
applyTranslations();
updateTimeline();
updateIngredients();
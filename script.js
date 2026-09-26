const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

async function loadTimeline() {
    const timeline = document.getElementById('timeline');

    try {
        const response = await fetch('timelineData.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        timeline.innerHTML = '';
        data.units.forEach(unit => timeline.appendChild(makeUnit(unit)));
    } catch (error) {
        console.error('Error loading timeline data:', error);
        timeline.innerHTML = '<p class="status">Error loading timeline data</p>';
    }
}

function makeUnit(unit) {
    const unitSection = document.createElement('section');
    unitSection.className = 'unit';
    unitSection.id = unit.number;
    unitSection.innerHTML = `
        <h2>${unit.unit}</h2>
        <p class="unit-summary">${unit.summary}</p>
    `;

    const eventList = document.createElement('div');
    eventList.className = 'event-list';

    // Each president is followed by the events of their term; a type "3" event (president change) ends the term
    const presidents = [...unit.presidents];
    const addNextPresident = () => {
        if (presidents.length) eventList.appendChild(makePresident(presidents.shift()));
    };

    addNextPresident();
    unit.events.forEach(event => {
        eventList.appendChild(makeEvent(event));
        if (event.type === "3") addNextPresident();
    });
    while (presidents.length) addNextPresident();

    unitSection.appendChild(eventList);
    return unitSection;
}

function makePresident(president) {
    const presidentDiv = document.createElement('div');
    presidentDiv.className = 'president';
    presidentDiv.innerHTML = `
        <h3>${president.name} <span class="president-term">(${president.year})</span></h3>
        <p class="president-party">${president.party}</p>
        <p>${president.description}</p>
    `;
    return presidentDiv;
}

function makeEvent(event) {
    const eventDiv = document.createElement('article');
    eventDiv.className = 'event';
    eventDiv.dataset.type = event.type;
    eventDiv.innerHTML = `
        <h4>${event.title}</h4>
        <p class="event-date">${formatDate(event.date)}</p>
        <p class="event-description">${event.description}</p>
    `;
    return eventDiv;
}

// "1776-07-04" -> "July 4, 1776" and "1831-08" -> "August 1831"; anything else ("1790s", "1756/1763") is shown as-is
function formatDate(date) {
    if (!date || !date.includes('-')) return date;

    const [year, month, day] = date.split('-');
    const monthName = MONTHS[parseInt(month) - 1];
    return day ? `${monthName} ${parseInt(day)}, ${year}` : `${monthName} ${year}`;
}

loadTimeline();

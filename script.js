async function loadTimeline() {
    try {
        const response = await fetch('timelineData.json');
        const data = await response.json();

        const timelineContainer = document.getElementById('timeline');
        timelineContainer.innerHTML = '';

        data.units.forEach(unit => {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit';
            unitDiv.id = unit.number;

            unitDiv.innerHTML = `
                <h1>${unit.unit}</h1>
                <p>${unit.summary}</p>
            `;

            const eventListDiv = document.createElement('div');
            eventListDiv.className = 'event-list';

            let remainingEvents = [...unit.events];

            if (unit.presidents.length == 0) {
                unit.events.forEach(event => {
                    const eventDiv = makeEvent(event);
                    eventListDiv.appendChild(eventDiv);
                });
            }
             
            unit.presidents.forEach(president => {
                const presidentDiv = document.createElement('div');
                presidentDiv.className = 'president';
                presidentDiv.innerHTML = `
                    <h2>${president.name} (${president.year})</h2>
                    <p>${president.description}, ${president.party}</p>
                `;
                eventListDiv.appendChild(presidentDiv);

                const presidentChangeIndex = remainingEvents.findIndex(event => event.type === "3");
                
                const eventsToShow = presidentChangeIndex !== -1 ? remainingEvents.slice(0, presidentChangeIndex+1) : remainingEvents;
                eventsToShow.forEach(event => {
                    const eventDiv = makeEvent(event);
                    eventListDiv.appendChild(eventDiv);
                });

                remainingEvents = remainingEvents.slice(presidentChangeIndex !== -1 ? presidentChangeIndex + 1 : 0);
            });

            unitDiv.appendChild(eventListDiv);
            timelineContainer.appendChild(unitDiv);
        });
    } catch (error) {
        console.error('Error loading timeline data:', error);
        const timelineContainer = document.getElementById('timeline');
        timelineContainer.innerHTML = '<p class="error">Error loading timeline data</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadTimeline);

function makeEvent(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.setAttribute('data-type', event.type);

    let formattedDate = getDate(event.date);

    eventDiv.innerHTML = `
        <h3>${event.title}</h3>
        <p class="event-date">${formattedDate}</p>
        <p class="event-description">${event.description}</p>
    `;

    return eventDiv;
}


function getDate(eventDate) {
    let formattedDate = eventDate;
    if (eventDate && eventDate.includes('-')) {
        const dateParts = eventDate.split('-');
        const year = dateParts[0];
        const month = getMonthName(parseInt(dateParts[1]));

        if (dateParts.length > 2 && dateParts[2]) {
            const day = parseInt(dateParts[2]);
            formattedDate = `${month} ${day}, ${year}`;
        } else {
            formattedDate = `${month}, ${year}`;
        }
    }
    return formattedDate;
}

function getMonthName(monthNum) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNum - 1];
}
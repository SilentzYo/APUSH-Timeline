async function loadTimeline() {
    try {
        const response = await fetch('timelineData.json');
        const data = await response.json();
        
        const timelineContainer = document.getElementById('timeline');
        timelineContainer.innerHTML = '';

        data.units.forEach(unit => {
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit';

            unitDiv.innerHTML=`
                <h1>${unit.unit}</h1>
                <p>${unit.summary}</p>
            `;

            unit.presidents.forEach(president => {
                if (president.name == "none") return;
                const presidentDiv = document.createElement('div');
                presidentDiv.className = 'president';
                presidentDiv.innerHTML = `
                    <h2>${president.name} (${president.year})</h2>
                    <p>${president.description}, ${president.party}</p>
                `;
                unitDiv.appendChild(presidentDiv);
            });

            const eventListDiv = document.createElement('div');
            eventListDiv.className = 'event-list';

            unit.events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.setAttribute('data-significance', event.significance);
                
                let formattedDate = event.date;
                if (event.date && event.date.includes('-')) {
                    const dateParts = event.date.split('-');
                    const year = dateParts[0];
                    const month = getMonthName(parseInt(dateParts[1]));
                    if (dateParts.length > 2 && dateParts[2]) {
                        const day = parseInt(dateParts[2]);
                        formattedDate = `${month} ${day}, ${year}`;
                    } else {
                        formattedDate = `${month}, ${year}`;
                    }
                }

                eventDiv.innerHTML = `
                    <h3>${event.title}</h3>
                    <p class="event-date">${formattedDate}</p>
                    <p class="event-description">${event.description}</p>
                `;

                eventListDiv.appendChild(eventDiv);
            });

            unitDiv.appendChild(eventListDiv);

            timelineContainer.appendChild(unitDiv);
        });
    } catch (error) {
        console.error('Error loading timeline data:', error);
        timelineContainer.innerHTML = '<p class="error">Error loading timeline data</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadTimeline);


function getMonthName(monthNum) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNum - 1];
}
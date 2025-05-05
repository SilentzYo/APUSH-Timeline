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
                const presidentDiv = document.createElement('div');
                presidentDiv.className = 'president';
                presidentDiv.innerHTML = `
                    <h2>${president.name} (${president.year})</h2>
                `;
                unitDiv.appendChild(presidentDiv);
            });

            unit.event.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                
                eventDiv.innerHTML = `
                    <h3>${event.title}</h3>
                    <p class="event-date">${event.date}</p>
                    <p class="event-description">${event.description}</p>
                    <p class="event-significance">Significance: ${event.significance}</p>
                `;

                unitDiv.appendChild(eventDiv);
            });
            
            timelineContainer.appendChild(unitDiv);
        });
    } catch (error) {
        console.error('Error loading timeline data:', error);
        timelineContainer.innerHTML = '<p class="error">Error loading timeline data</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadTimeline);
import { db } from "./firebase.js";

import {

    collection,
    getDocs

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";




// CONTAINER
const eventsContainer = document.getElementById("eventsContainer");




// SEARCH
const searchInput = document.getElementById("searchInput");




// ALL EVENTS
let allEvents = [];




// LOAD EVENTS
async function loadEvents(){


    try{

        eventsContainer.innerHTML = "<h2>Loading Events...</h2>";




        const querySnapshot = await getDocs(
            collection(db, "events")
        );




        allEvents = [];




        querySnapshot.forEach((doc) => {

            const event = {

                id: doc.id,

                ...doc.data()

            };



            allEvents.push(event);

        });




        displayEvents(allEvents);

    }

    catch(error){

        console.log(error);

    }

}




// DISPLAY EVENTS
function displayEvents(events){

    eventsContainer.innerHTML = "";




    if(events.length === 0){

        eventsContainer.innerHTML = `

        <h2>No Events Found</h2>

        `;

        return;
    }




    events.forEach((event) => {

        eventsContainer.innerHTML += `

        <div 
            class="event-card"

            onclick="window.location.href='event-details.html?id=${event.id}'"
        >

            <img 
                src="${event.imageUrl}" 
                class="event-image"
            >

            <div class="event-content">

                <span class="event-category">
                    ${event.category}
                </span>

                <h2 class="event-title">
                    ${event.title}
                </h2>

                <p class="event-location">
                    📍 ${event.location}
                </p>

                <p class="event-date">
                    📅 ${event.date} • ${event.time}
                </p>

                <p class="event-price">
                    NGN ${event.ticketPrice}
                </p>

            </div>

        </div>

        `;

    });

}




// SEARCH EVENTS
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase();




    const filteredEvents = allEvents.filter((event) => {

        return event.title.toLowerCase().includes(value);

    });




    displayEvents(filteredEvents);

});




// INITIAL LOAD
loadEvents();
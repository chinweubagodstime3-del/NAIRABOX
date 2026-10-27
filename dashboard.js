import {

    auth,
    db

} from "./firebase.js";



import {

    signOut,
    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";



import {

    collection,
    getDocs,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";





// ELEMENTS
const welcomeUser = document.getElementById("welcomeUser");

const logoutBtn = document.getElementById("logoutBtn");

const eventsContainer = document.getElementById("eventsContainer");





// CHECK USER
onAuthStateChanged(auth, async (user) => {

    if(user){

        // SHOW USER
        welcomeUser.innerHTML = `Welcome ${user.email}`;




        // LOAD EVENTS
        loadUserEvents(user.email);

    }

    else{

        // REDIRECT IF NOT LOGGED IN
        window.location.href = "./login.html";

    }

});






// LOAD USER EVENTS
async function loadUserEvents(userEmail){

    try{

        eventsContainer.innerHTML = "<h2>Loading Events...</h2>";




        const querySnapshot = await getDocs(
            collection(db, "events")
        );




        eventsContainer.innerHTML = "";




        let hasEvents = false;





        querySnapshot.forEach((document) => {

            const event = document.data();

            const eventId = document.id;





            // SHOW ONLY USER EVENTS
            if(event.createdBy === userEmail){

                hasEvents = true;





                eventsContainer.innerHTML += `

                <div class="event-card">

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




                        <div class="event-actions">

                            <button 
                                class="edit-btn"

                                onclick="editEvent('${eventId}')"
                            >
                                Edit
                            </button>





                            <button 
                                class="delete-btn"

                                onclick="deleteEvent('${eventId}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

                `;
            }

        });





        // NO EVENTS
        if(!hasEvents){

            eventsContainer.innerHTML = `

            <h2>No Events Created Yet</h2>

            `;
        }

    }

    catch(error){

        console.log(error);

    }

}







// DELETE EVENT
window.deleteEvent = async function(eventId){

    const confirmDelete = confirm(
        "Are you sure you want to delete this event?"
    );




    if(!confirmDelete){

        return;
    }




    try{

        await deleteDoc(doc(db, "events", eventId));




        alert("Event Deleted");




        // RELOAD PAGE
        location.reload();

    }

    catch(error){

        console.log(error);

    }

}







// EDIT EVENT
window.editEvent = function(eventId){

    window.location.href = `edit-event.html?id=${eventId}`;

}







// LOGOUT
logoutBtn.addEventListener("click", async () => {

    try{

        await signOut(auth);




        alert("Logged Out");




        window.location.href = "./login.html";

    }

    catch(error){

        alert(error.message);

    }

});
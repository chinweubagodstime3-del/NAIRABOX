import { db, auth } from "./firebase.js";

import {

    collection,
    addDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";




// FORM
const eventForm = document.getElementById("eventForm");




// CREATE EVENT
eventForm.addEventListener("submit", async (e) => {

    e.preventDefault();




    // BUTTON
    const publishBtn = document.getElementById("publishBtn");

    publishBtn.innerHTML = "Publishing...";




    // GET VALUES
    const title = document.getElementById("eventTitle").value;

    const category = document.getElementById("eventCategory").value;

    const description = document.getElementById("eventDescription").value;

    const location = document.getElementById("eventLocation").value;

    const date = document.getElementById("eventDate").value;

    const time = document.getElementById("eventTime").value;

    const ticketPrice = document.getElementById("ticketPrice").value;

    const imageUrl = document.getElementById("eventImage").value;





    try{




        // SAVE TO FIRESTORE
        await addDoc(collection(db, "events"), {

            title,
            category,
            description,
            location,
            date,
            time,
            ticketPrice,
            imageUrl,

            createdBy: auth.currentUser.email,

            createdAt: new Date()

        });




        alert("Event Published Successfully");




        // RESET
        eventForm.reset();




        // REDIRECT
        window.location.href = "./dashboard.html";

    }

    catch(error){

        alert(error.message);

        console.log(error);

    }

    finally{

        publishBtn.innerHTML = "Publish Event";

    }

});
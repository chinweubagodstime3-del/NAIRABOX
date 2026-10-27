import { db } from "./firebase.js";

import {

    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";




// GET URL PARAM
const params = new URLSearchParams(window.location.search);

const eventId = params.get("id");




// HTML ELEMENTS
const detailsImage = document.getElementById("detailsImage");

const detailsCategory = document.getElementById("detailsCategory");

const detailsTitle = document.getElementById("detailsTitle");

const detailsLocation = document.getElementById("detailsLocation");

const detailsDate = document.getElementById("detailsDate");

const detailsDescription = document.getElementById("detailsDescription");

const detailsPrice = document.getElementById("detailsPrice");




// LOAD EVENT
async function loadEvent(){


    try{

        const docRef = doc(db, "events", eventId);

        const docSnap = await getDoc(docRef);




        if(docSnap.exists()){

            const event = docSnap.data();




            detailsImage.src = event.imageUrl;

            detailsCategory.innerHTML = event.category;

            detailsTitle.innerHTML = event.title;

            detailsLocation.innerHTML = `📍 ${event.location}`;

            detailsDate.innerHTML = `📅 ${event.date} • ${event.time}`;

            detailsDescription.innerHTML = event.description;

            detailsPrice.innerHTML = `NGN ${event.ticketPrice}`;

        }

        else{

            alert("Event Not Found");

        }

    }

    catch(error){

        console.log(error);

    }

}




loadEvent();
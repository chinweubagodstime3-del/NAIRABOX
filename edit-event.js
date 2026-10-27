
import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const eventForm = document.getElementById("eventForm");
const pageMessage = document.getElementById("pageMessage");
const saveBtn = document.getElementById("saveBtn");

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

function showMessage(message, type = "") {
    if (!pageMessage) return;

    pageMessage.textContent = message;
    pageMessage.className = "page-message";

    if (type) {
        pageMessage.classList.add(type);
    }

    pageMessage.hidden = false;
}

function setFormVisible(visible) {
    if (eventForm) {
        eventForm.hidden = !visible;
    }
}

function setField(id, value) {
    const field = document.getElementById(id);

    if (field) {
        field.value = value ?? "";
    }
}

function getField(id) {
    return document.getElementById(id)?.value.trim() ?? "";
}

if (!eventForm || !pageMessage || !saveBtn) {
    console.error(
        "The edit form is missing required HTML elements. Check eventForm, pageMessage, and saveBtn."
    );
} else if (!eventId) {
    showMessage(
        "No event ID was provided. Return to your dashboard and click Edit again.",
        "error"
    );
} else {
    setFormVisible(false);

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "./login.html";
            return;
        }

        try {
            showMessage("Loading event details...");

            const eventRef = doc(db, "events", eventId);
            const eventSnapshot = await getDoc(eventRef);

            if (!eventSnapshot.exists()) {
                showMessage(
                    "This event could not be found. It may have been deleted.",
                    "error"
                );
                return;
            }

            const event = eventSnapshot.data();

            if (event.createdBy !== user.email) {
                showMessage(
                    "You can only edit events created by your account.",
                    "error"
                );
                return;
            }

            setField("eventTitle", event.title);
            setField("eventCategory", event.category);
            setField("eventDescription", event.description);
            setField("eventLocation", event.location);
            setField("eventDate", event.date);
            setField("eventTime", event.time);
            setField("ticketPrice", event.ticketPrice);
            setField("eventImage", event.imageUrl);

            setFormVisible(true);
            showMessage("Event details loaded successfully.", "success");
        } catch (error) {
            console.error("Error loading event:", error);

            showMessage(
                "Could not load this event. Check your internet connection and Firebase permissions.",
                "error"
            );
        }
    });

    eventForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = auth.currentUser;

        if (!user) {
            showMessage("Please sign in again.", "error");
            return;
        }

        const title = getField("eventTitle");
        const category = getField("eventCategory");
        const description = getField("eventDescription");
        const location = getField("eventLocation");
        const date = getField("eventDate");
        const time = getField("eventTime");
        const ticketPrice = getField("ticketPrice");
        const imageUrl = getField("eventImage");

        if (
            !title ||
            !category ||
            !description ||
            !location ||
            !date ||
            !time ||
            !ticketPrice
        ) {
            showMessage("Please complete all required event fields.", "error");
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Saving Changes...";

        try {
            const eventRef = doc(db, "events", eventId);
            const eventSnapshot = await getDoc(eventRef);

            if (!eventSnapshot.exists()) {
                showMessage("This event no longer exists.", "error");
                return;
            }

            if (eventSnapshot.data().createdBy !== user.email) {
                showMessage(
                    "You do not have permission to edit this event.",
                    "error"
                );
                return;
            }

            await updateDoc(eventRef, {
                title,
                category,
                description,
                location,
                date,
                time,
                ticketPrice,
                imageUrl
            });

            showMessage("Event updated successfully!", "success");

            window.setTimeout(() => {
                window.location.href = "./dashboard.html";
            }, 1000);
        } catch (error) {
            console.error("Error updating event:", error);

            showMessage(
                "Could not save your changes. Please check Firebase permissions and try again.",
                "error"
            );
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = "Save Changes";
        }
    });
}

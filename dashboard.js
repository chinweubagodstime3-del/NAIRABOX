import { auth, db } from "./firebase.js";

import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// =========================
// PAGE ELEMENTS
// =========================

const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");
const allEventsBtn = document.getElementById("allEventsBtn");
const eventsContainer = document.getElementById("eventsContainer");

// Keep track of the signed-in organiser.
let currentUser = null;

// =========================
// AUTHENTICATION CHECK
// =========================

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("./login.html");
        return;
    }

    currentUser = user;

    const displayName = user.email
        ? user.email.split("@")[0]
        : "Organiser";

    welcomeUser.textContent = `Welcome ${displayName}`;

    await loadUserEvents(user);
});

// =========================
// LOAD ORGANISER EVENTS
// =========================

async function loadUserEvents(user) {
    eventsContainer.replaceChildren();

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Loading your events...";
    eventsContainer.appendChild(loadingMessage);

    try {
        const querySnapshot = await getDocs(
            collection(db, "events")
        );

        eventsContainer.replaceChildren();

        let hasEvents = false;

        querySnapshot.forEach((eventDocument) => {
            const event = eventDocument.data();
            const eventId = eventDocument.id;

            // Show only events created by the signed-in organiser.
            if (event.createdBy !== user.email) {
                return;
            }

            hasEvents = true;

            const card = createEventCard(event, eventId);
            eventsContainer.appendChild(card);
        });

        if (!hasEvents) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "empty-state";
            emptyMessage.textContent =
                "You haven't created any events yet. Create your first event to get started.";

            eventsContainer.appendChild(emptyMessage);
        }
    } catch (error) {
        console.error("Error loading events:", error);

        eventsContainer.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className = "empty-state";
        errorMessage.textContent =
            "We couldn't load your events. Please check your connection and try again.";

        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.textContent = "Try Again";
        retryButton.className = "edit-btn";

        retryButton.addEventListener("click", () => {
            loadUserEvents(user);
        });

        eventsContainer.append(errorMessage, retryButton);
    }
}

// =========================
// CREATE EVENT CARD
// =========================

function createEventCard(event, eventId) {
    const card = document.createElement("article");
    card.className = "event-card";

    // Event image
    if (event.imageUrl) {
        try {
            const imageUrl = new URL(event.imageUrl);

            if (imageUrl.protocol === "https:" ||
                imageUrl.protocol === "http:") {
                const image = document.createElement("img");

                image.src = imageUrl.href;
                image.alt = event.title
                    ? `${event.title} event`
                    : "Event image";
                image.className = "event-image";
                image.loading = "lazy";

                image.addEventListener("error", () => {
                    image.remove();
                });

                card.appendChild(image);
            }
        } catch {
            // Skip invalid image URLs.
        }
    }

    const content = document.createElement("div");
    content.className = "event-content";

    const category = document.createElement("span");
    category.className = "event-category";
    category.textContent = event.category || "General";

    const title = document.createElement("h2");
    title.className = "event-title";
    title.textContent = event.title || "Untitled Event";

    const location = document.createElement("p");
    location.className = "event-location";
    location.textContent = `📍 ${event.location || "Location not provided"}`;

    const date = document.createElement("p");
    date.className = "event-date";

    const eventDate = event.date || "Date not set";
    const eventTime = event.time || "Time not set";

    date.textContent = `📅 ${eventDate} • ${eventTime}`;

    const price = document.createElement("p");
    price.className = "event-price";

    const ticketPrice = Number(event.ticketPrice);

    if (
        event.ticketPrice !== undefined &&
        event.ticketPrice !== null &&
        event.ticketPrice !== "" &&
        Number.isFinite(ticketPrice)
    ) {
        price.textContent = `₦${ticketPrice.toLocaleString("en-NG")}`;
    } else {
        price.textContent = "Price not set";
    }

    // Event action buttons
    const actions = document.createElement("div");
    actions.className = "event-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        window.editEvent(eventId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", () => {
        window.deleteEvent(eventId);
    });

    actions.append(editButton, deleteButton);

    content.append(
        category,
        title,
        location,
        date,
        price,
        actions
    );

    card.appendChild(content);

    return card;
}

// =========================
// DELETE EVENT
// =========================

window.deleteEvent = async function (eventId) {
    if (!currentUser) {
        alert("Please sign in before managing events.");
        window.location.href = "./login.html";
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const eventReference = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventReference);

        if (!eventSnapshot.exists()) {
            alert("This event no longer exists.");
            await loadUserEvents(currentUser);
            return;
        }

        const event = eventSnapshot.data();

        // Confirm that the event belongs to the signed-in organiser.
        if (event.createdBy !== currentUser.email) {
            alert("You don't have permission to delete this event.");
            return;
        }

        await deleteDoc(eventReference);

        alert("Event deleted successfully.");

        await loadUserEvents(currentUser);
    } catch (error) {
        console.error("Error deleting event:", error);
        alert("We couldn't delete this event. Please try again.");
    }
};

// =========================
// EDIT EVENT
// =========================

window.editEvent = function (eventId) {
    if (!currentUser) {
        alert("Please sign in to edit events.");
        return;
    }

    window.location.href =
        `./edit-event.html?id=${encodeURIComponent(eventId)}`;
};

// =========================
// ALL EVENTS BUTTON
// =========================

if (allEventsBtn) {
    allEventsBtn.addEventListener("click", () => {
        document.querySelector(".events-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging Out...";

    try {
        await signOut(auth);
        window.location.replace("./login.html");
    } catch (error) {
        console.error("Logout error:", error);
        alert("We couldn't log you out. Please try again.");

        logoutBtn.disabled = false;
        logoutBtn.textContent = "Logout";
    }
});

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// ============================
// GET HTML ELEMENTS
// ============================

const signinBox = document.getElementById("signinBox");
const signupBox = document.getElementById("signupBox");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");

const signupForm = document.getElementById("signupForm");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupBtn = document.getElementById("signupBtn");

// ============================
// SWITCH TO CREATE ACCOUNT
// ============================

showSignup.addEventListener("click", () => {
    signinBox.hidden = true;
    signupBox.hidden = false;
});

// ============================
// SWITCH TO SIGN IN
// ============================

showLogin.addEventListener("click", () => {
    signupBox.hidden = true;
    signinBox.hidden = false;
});

// ============================
// LOGIN USER
// ============================

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing In...";

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log(
            "Login successful:",
            userCredential.user.email
        );

        // Wait until Firebase confirms the authentication state.
        await auth.authStateReady();

        if (auth.currentUser) {
            window.location.href = "./dashboard.html";
        } else {
            alert(
                "Your login session could not be confirmed. Please try signing in again."
            );
        }

    } catch (error) {
        console.error("Login error:", error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            alert("Incorrect email or password. Please try again.");

        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");

        } else if (error.code === "auth/too-many-requests") {
            alert("Too many attempts. Please wait a while and try again.");

        } else {
            alert("Login failed: " + error.message);
        }

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "SIGN IN";
    }
});

// ============================
// CREATE NEW ACCOUNT
// ============================

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password.length < 6) {
        alert("Your password must contain at least 6 characters.");
        return;
    }

    signupBtn.disabled = true;
    signupBtn.textContent = "Creating Account...";

    try {
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Account created successfully! You can now sign in.");

        // Return to the sign-in form.
        signupBox.hidden = true;
        signinBox.hidden = false;

        // Fill in the email for convenience.
        loginEmail.value = email;
        loginPassword.value = "";

        signupForm.reset();

    } catch (error) {
        console.error("Signup error:", error);

        if (error.code === "auth/email-already-in-use") {
            alert("This email already has an account. Please sign in.");

        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email address.");

        } else if (error.code === "auth/weak-password") {
            alert("Please choose a stronger password with at least 6 characters.");

        } else {
            alert("Account creation failed: " + error.message);
        }

    } finally {
        signupBtn.disabled = false;
        signupBtn.textContent = "CREATE ACCOUNT";
    }
});

import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMessage.textContent = "";
    successMessage.textContent = "";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const selectedRole = document.getElementById("role").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Fetch user role from database
            get(ref(db, 'users/' + user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const role = userData.role || "user";
                    if (role !== selectedRole) {
                        errorMessage.textContent = "Role mismatch. Please select the correct role.";
                        return;
                    }
                    successMessage.textContent = "Login successful! Redirecting...";
                    if (role === "admin") {
                        setTimeout(() => {
                            window.location.href = "admin.html";
                        }, 1500);
                    } else if (role === "trainee") {
                        setTimeout(() => {
                            window.location.href = "trainee-dashboard.html";
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 1500);
                    }
                } else {
                    errorMessage.textContent = "User data not found.";
                }
            }).catch((error) => {
                errorMessage.textContent = error.message;
            });
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMessage.textContent = "";
    successMessage.textContent = "";

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            if (role === 'admin') {
                // Check if an admin already exists
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const adminExists = Object.values(users).some(u => u.role === 'admin');
                    if (adminExists) {
                        errorMessage.textContent = "Admin already exists. Only one admin allowed.";
                        // Delete the newly created user to prevent orphan user
                        user.delete();
                        return;
                    }
                }
            }
            if (role === 'trainee') {
                // Redirect to trainee registration page for additional details
                window.location.href = `trainee-registration.html?uid=${user.uid}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`;
                return;
            }
            // Save additional user info in database with selected role
            set(ref(db, 'users/' + user.uid), {
                name: name,
                phone: phone,
                email: email,
                role: role,
                createdAt: new Date().toISOString()
            }).then(() => {
                successMessage.textContent = "Registration successful! Redirecting to login...";
                registerForm.reset();
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }).catch((error) => {
                errorMessage.textContent = error.message;
            });
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

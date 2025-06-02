import { db } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid');
const name = urlParams.get('name');
const phone = urlParams.get('phone');
const email = urlParams.get('email');

const form = document.getElementById('traineeRegistrationForm');
const message = document.getElementById('message');

document.getElementById('uid').value = uid || '';
document.getElementById('name').value = name ? decodeURIComponent(name) : '';
document.getElementById('phone').value = phone ? decodeURIComponent(phone) : '';
document.getElementById('email').value = email ? decodeURIComponent(email) : '';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    message.textContent = '';

    const services = document.getElementById('services').value;
    const experience = document.getElementById('experience').value;
    const certifications = document.getElementById('certifications').value;

    if (!services || !experience || !certifications) {
        message.textContent = 'Please fill in all required fields.';
        return;
    }

    const traineeData = {
        uid: uid,
        name: decodeURIComponent(name),
        phone: decodeURIComponent(phone),
        email: decodeURIComponent(email),
        services: services,
        experience: experience,
        certifications: certifications,
        createdAt: new Date().toISOString(),
        approved: false
    };

    set(ref(db, 'trainees/' + uid), traineeData)
        .then(() => {
            message.textContent = 'Trainee registration submitted for admin approval.';
            form.reset();
        })
        .catch((error) => {
            message.textContent = 'Error submitting registration: ' + error.message;
        });
});

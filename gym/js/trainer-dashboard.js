import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const bookingsTableBody = document.querySelector("#trainerBookingsTable tbody");
const profileDetailsDiv = document.getElementById("profileDetails");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Fetch trainer profile
        get(ref(db, 'users/' + user.uid)).then(snapshot => {
            if (snapshot.exists()) {
                const profile = snapshot.val();
                if (profile.role !== 'trainer') {
                    alert('Access denied. Trainers only.');
                    window.location.href = 'login.html';
                    return;
                }
                displayProfile(profile);
                fetchBookings(user.uid);
            } else {
                alert('Profile not found.');
                window.location.href = 'login.html';
            }
        }).catch(error => {
            console.error('Error fetching profile:', error);
            alert('Error fetching profile.');
            window.location.href = 'login.html';
        });
    } else {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html';
    }
});

function displayProfile(profile) {
    profileDetailsDiv.innerHTML = `
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Email:</strong> ${profile.email}</p>
        <p><strong>Phone:</strong> ${profile.phone}</p>
        <p><strong>Role:</strong> ${profile.role}</p>
        <p><strong>Approved:</strong> ${profile.approved ? 'Yes' : 'No'}</p>
    `;
}

function fetchBookings(trainerUid) {
    const bookingsRef = ref(db, 'bookings');
    onValue(bookingsRef, (snapshot) => {
        bookingsTableBody.innerHTML = "";
        const bookings = snapshot.val();
        if (bookings) {
            Object.values(bookings).forEach(booking => {
                if (booking.trainerUid === trainerUid) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${booking.name}</td>
                        <td>${booking.email}</td>
                        <td>${booking.phone}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td>${booking.service}</td>
                    `;
                    bookingsTableBody.appendChild(row);
                }
            });
        }
    });
}

logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});

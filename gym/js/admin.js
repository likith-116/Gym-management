import { auth, db } from './firebase-config.js';
import { ref, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const bookingsTableBody = document.querySelector("#bookingsTable tbody");
const transactionsTableBody = document.querySelector("#transactionsTable tbody");
const trainerApprovalsTableBody = document.querySelector("#trainerApprovalsTable tbody");
const traineeApprovalsTableBody = document.querySelector("#traineeApprovalsTable tbody");

const totalBookingsCard = document.getElementById("totalBookings");
const totalRevenueCard = document.getElementById("totalRevenue");
const totalUsersCard = document.getElementById("totalUsers");

const bookingsChartCtx = document.getElementById('bookingsChart')?.getContext('2d');
const revenueChartCtx = document.getElementById('revenueChart')?.getContext('2d');

let bookingsChart;
let revenueChart;

// Fetch and display bookings
const bookingsRef = ref(db, 'bookings');
onValue(bookingsRef, (snapshot) => {
    bookingsTableBody.innerHTML = "";
    const bookings = snapshot.val();
    if (bookings) {
        Object.values(bookings).forEach(booking => {
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
        });
        updateMetricsAndCharts(bookings);
    } else {
        updateMetricsAndCharts({});
    }
});

// Fetch and display transactions
const transactionsRef = ref(db, 'transactions');
onValue(transactionsRef, (snapshot) => {
    transactionsTableBody.innerHTML = "";
    const transactions = snapshot.val();
    if (transactions) {
        Object.values(transactions).forEach(tx => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${tx.paymentId}</td>
                <td>${tx.bookingId}</td>
                <td>${tx.orderId || ''}</td>
                <td>${(tx.amount / 100).toFixed(2)}</td>
                <td>${new Date(tx.timestamp).toLocaleString()}</td>
            `;
            transactionsTableBody.appendChild(row);
        });
    }
});

// Fetch and display trainer registrations pending approval
const trainersRef = ref(db, 'users');
onValue(trainersRef, (snapshot) => {
    trainerApprovalsTableBody.innerHTML = "";
    const users = snapshot.val();
    if (users) {
        Object.entries(users).forEach(([uid, user]) => {
            if (user.role === 'trainer' && user.approved === false) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.approved}</td>
                    <td><button data-uid="${uid}" class="approveTrainerBtn">Approve</button></td>
                `;
                trainerApprovalsTableBody.appendChild(row);
            }
        });
        addTrainerApproveListeners();
    }
});

// Fetch and display trainee registrations pending approval
const traineesRef = ref(db, 'trainees');
onValue(traineesRef, (snapshot) => {
    traineeApprovalsTableBody.innerHTML = "";
    const trainees = snapshot.val();
    if (trainees) {
        Object.entries(trainees).forEach(([uid, trainee]) => {
            if (trainee.approved === false) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${trainee.name}</td>
                    <td>${trainee.email}</td>
                    <td>${trainee.phone}</td>
                    <td>${trainee.services}</td>
                    <td>${trainee.experience}</td>
                    <td>${trainee.certifications}</td>
                    <td>${trainee.approved}</td>
                    <td><button data-uid="${uid}" class="approveTraineeBtn">Approve</button></td>
                `;
                traineeApprovalsTableBody.appendChild(row);
            }
        });
        addTraineeApproveListeners();
    }
});

// Add event listeners for trainer approve buttons
function addTrainerApproveListeners() {
    const buttons = document.querySelectorAll(".approveTrainerBtn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const uid = button.getAttribute("data-uid");
            approveTrainer(uid);
        });
    });
}

// Add event listeners for trainee approve buttons
function addTraineeApproveListeners() {
    const buttons = document.querySelectorAll(".approveTraineeBtn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const uid = button.getAttribute("data-uid");
            approveTrainee(uid);
        });
    });
}

// Approve trainer by updating approved field to true
function approveTrainer(uid) {
    const userRef = ref(db, 'users/' + uid);
    update(userRef, { approved: true })
        .then(() => {
            alert("Trainer approved successfully.");
        })
        .catch((error) => {
            alert("Error approving trainer: " + error.message);
        });
}

// Approve trainee by updating approved field to true
function approveTrainee(uid) {
    const traineeRef = ref(db, 'trainees/' + uid);
    update(traineeRef, { approved: true })
        .then(() => {
            alert("Trainee approved successfully.");
        })
        .catch((error) => {
            alert("Error approving trainee: " + error.message);
        });
}

// Fetch total users count
async function fetchTotalUsers() {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
        const users = snapshot.val();
        totalUsersCard.textContent = Object.keys(users).length;
    } else {
        totalUsersCard.textContent = 0;
    }
}

// Update metrics cards and charts
function updateMetricsAndCharts(bookings) {
    const bookingList = Object.values(bookings);
    totalBookingsCard.textContent = bookingList.length;

    // Calculate total revenue from transactions
    get(ref(db, 'transactions')).then(snapshot => {
        let totalRevenue = 0;
        if (snapshot.exists()) {
            const transactions = snapshot.val();
            Object.values(transactions).forEach(tx => {
                totalRevenue += tx.amount;
            });
        }
        totalRevenueCard.textContent = (totalRevenue / 100).toFixed(2);
    });

    // Prepare data for charts
    const bookingsByDate = {};
    const revenueByDate = {};

    bookingList.forEach(booking => {
        const date = booking.date;
        bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });

    get(ref(db, 'transactions')).then(snapshot => {
        if (snapshot.exists()) {
            const transactions = snapshot.val();
            Object.values(transactions).forEach(tx => {
                const date = new Date(tx.timestamp).toISOString().split('T')[0];
                revenueByDate[date] = (revenueByDate[date] || 0) + tx.amount;
            });
        }

        renderCharts(bookingsByDate, revenueByDate);
    });
}

// Render charts using Chart.js
function renderCharts(bookingsByDate, revenueByDate) {
    const bookingDates = Object.keys(bookingsByDate).sort();
    const bookingCounts = bookingDates.map(date => bookingsByDate[date]);

    const revenueDates = Object.keys(revenueByDate).sort();
    const revenueAmounts = revenueDates.map(date => (revenueByDate[date] / 100).toFixed(2));

    if (bookingsChart) bookingsChart.destroy();
    bookingsChart = new Chart(bookingsChartCtx, {
        type: 'line',
        data: {
            labels: bookingDates,
            datasets: [{
                label: 'Bookings Over Time',
                data: bookingCounts,
                borderColor: '#3399cc',
                backgroundColor: 'rgba(51, 153, 204, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Number of Bookings' }, beginAtZero: true }
            }
        }
    });

    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(revenueChartCtx, {
        type: 'bar',
        data: {
            labels: revenueDates,
            datasets: [{
                label: 'Revenue Over Time (INR)',
                data: revenueAmounts,
                backgroundColor: '#3399cc'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Revenue (INR)' }, beginAtZero: true }
            }
        }
    });
}

// Initialize total users count
fetchTotalUsers();

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    });
}

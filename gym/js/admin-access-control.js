import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const snapshot = await get(ref(db, 'users/' + user.uid));
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.role !== 'admin') {
                    alert('Access denied. Admins only.');
                    window.location.href = 'index.html';
                }
            } else {
                alert('User data not found.');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error verifying user role.');
            window.location.href = 'login.html';
        }
    } else {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html';
    }
});

import { db } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Razorpay script
const razorpayScript = document.createElement('script');
razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
document.head.appendChild(razorpayScript);

document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const bookingId = Date.now().toString();

    // Collect booking data
    const bookingData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        service: document.getElementById("service").value
    };

    // Amount in paise (example: 500 INR)
    const amount = 50000; // You can customize amount based on service

    // Razorpay options
    const options = {
        key: "rzp_test_aInlr2JkOeUewn", // TODO: Replace with your actual Razorpay key from Razorpay dashboard
        amount: amount,
        currency: "INR",
        name: "Akshat Fitness",
        description: "Training Session Booking",
        handler: function (response) {
            // On successful payment, save booking and transaction
            set(ref(db, 'bookings/' + bookingId), bookingData)
            .then(() => {
                // Save transaction details
                set(ref(db, 'transactions/' + response.razorpay_payment_id), {
                    bookingId: bookingId,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id || "",
                    signature: response.razorpay_signature || "",
                    amount: amount,
                    timestamp: new Date().toISOString()
                });
                alert("Booking and payment successful! We will contact you soon.");
                document.getElementById("bookingForm").reset();
            })
            .catch((error) => {
                alert("Error saving booking: " + error.message);
            });
        },
        prefill: {
            name: bookingData.name,
            email: bookingData.email,
            contact: bookingData.phone
        },
        theme: {
            color: "#3399cc"
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
});

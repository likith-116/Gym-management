# Gym Management System

## Project Overview
This is a Gym Management System web application designed to manage gym services, bookings, user registrations, and role-based access control. The system supports multiple user roles including admin, trainee, and trainer, each with specific dashboards and functionalities.

## Features
- User authentication and role-based access control using Firebase Authentication and Realtime Database.
- Admin dashboard to manage bookings, transactions, approve trainers and trainees, and view metrics and charts.
- Trainee dashboard to view profile details and bookings, with admin approval workflow.
- Trainer dashboard to view profile details and bookings.
- Booking system integrated with Razorpay for secure payment processing.
- Responsive and modern UI with role-specific pages.
- Real-time data updates using Firebase Realtime Database.
- Customer reviews section with ratings and testimonials.

## Technologies Used
- HTML5, CSS3, JavaScript (ES6+)
- Firebase Authentication and Realtime Database
- Razorpay Payment Gateway
- Chart.js for data visualization
- AOS (Animate On Scroll) library for animations
- Boxicons for icons
- Google Fonts (Poppins)

## Folder Structure
- `gym/` - Contains all HTML, CSS, images, and JavaScript files.
  - `js/` - JavaScript files for different roles and functionalities.
  - CSS files for styling different pages.
  - HTML files for different pages like admin, trainee dashboard, login, register, etc.
  - Images used in the website.

## Setup and Installation
1. Clone the repository.
2. Open the `gym` folder in your preferred code editor.
3. Ensure you have internet connectivity for Firebase, Razorpay, and external libraries.
4. Update Firebase configuration in `js/firebase-config.js` with your Firebase project credentials.
5. Update Razorpay key in `js/booking.js` with your Razorpay API key.
6. Open `index.html` in a browser to start using the application.

## Usage
- Register as a user selecting the appropriate role (admin, trainee, trainer).
- Trainees need to complete additional registration and await admin approval.
- Admin can approve trainers and trainees from the admin dashboard.
- Users can login and access their respective dashboards.
- Book training sessions and make payments via Razorpay.
- View customer reviews and other information on the homepage.

## Testing
- The application is responsive and tested on various screen sizes.
- Authentication and role-based access control tested with Firebase.
- Payment integration tested with Razorpay test keys.
- Real-time updates verified with Firebase Realtime Database.

## Contribution
Feel free to fork the repository and submit pull requests for improvements or bug fixes.

## License
This project is open source and available under the MIT License.

## Contact
For any queries or support, please contact the project maintainer.

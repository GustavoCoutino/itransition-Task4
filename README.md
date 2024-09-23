# Admin Dashboard Application

This project is a web application built using React and Node.js. It allows an admin to manage users by blocking, unblocking, or deleting accounts. The application communicates with a backend API to retrieve, modify, and delete user data.

## Features

- **User Management:**
  - Admins can block or unblock users.
  - Admins can delete users from the system.
  - Displays a list of all users, their status (active or blocked), last login time, and email.
- **Authentication:**
  - Users are redirected to the login page if they are blocked or deleted.
  - Authenticated users can access the admin dashboard.
- **Batch Actions:**
  - Admins can select multiple users at once and apply batch actions such as blocking, unblocking, or deleting.

## Technologies Used

- **Frontend:** React, React Router, Axios, SweetAlert2 for notifications
- **Backend:** Node.js (API is hosted on [Render])

# React Slinkup

React Slinkup is a social networking application built with React, Firebase, and Bootstrap. It allows users to connect with each other, share posts, follow other users, and engage in conversations.

## Features and Functionality

-   **User Authentication:** Secure user registration, login, and logout using Firebase Authentication.
-   **Profile Management:** Users can create and customize their profiles, including uploading avatars, adding personal information, and managing social links.
-   **Post Creation and Management:** Users can create, edit, and delete posts with text and images.
-   **Feed:** A personalized feed displaying posts from followed users and the user's own posts.
-   **Following/Followers:** Users can follow other users to see their posts in their feed.
-   **Likes and Comments:** Users can like and comment on posts.
-   **Search:** Ability to search for users and posts.
-   **Notifications:** Real-time notifications for likes, comments, and follows.
-   **Admin Dashboard:** (Admin Role) An admin dashboard to manage users (update and delete).
-   **Responsive Design:** The application is designed to be responsive and accessible on various devices.
-   **Appearance Settings:** Users can switch between light and dark themes.
-   **Infinite Scroll:** The feed implements infinite scroll to load posts as the user scrolls down.
-   **Profile settings:** Users can update their profile information including personal details and privacy settings.

## Technology Stack

-   **React:** A JavaScript library for building user interfaces.
-   **Firebase:** A backend-as-a-service (BaaS) platform for authentication, database (Firestore), and storage.
-   **Bootstrap:** A CSS framework for responsive and mobile-first front-end development.
-   **React Router:** A library for declarative routing in React applications.
-   **React Toastify:** A library for displaying toast notifications.
-   **Axios:** A promise-based HTTP client for making API requests.
-   **Date-fns:** A modern JavaScript date utility library.
-   **Lodash:** A JavaScript utility library providing helpful functional programming utilities.
-   **React Icons:** A library for using icons in React applications.
-   **React Infinite Scroll Component:** A library for creating infinite scrollable lists in React.

## Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js:** (>=14.0.0) - [https://nodejs.org/](https://nodejs.org/)
-   **npm:** (>=6.0.0) - comes with Node.js
-   **Firebase Account:** You will need a Firebase project to configure the application.

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sharfrasaqsan/react-slinkup.git
    cd react-slinkup
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Firebase:**

    -   Create a new Firebase project in the Firebase Console ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
    -   Enable Authentication and Firestore Database.
    -   Copy the Firebase configuration object from your Firebase project settings.
    -   Replace the placeholder values in `src/firebase/Config.js` with your Firebase configuration:

        ```javascript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
        };
        ```

## Usage Guide

1.  **Start the development server:**

    ```bash
    npm start
    ```

    This will start the React development server and open the application in your default browser.

2.  **Register and Login:**
    -   Navigate to the `/register` route to create a new account.
    -   Navigate to the `/login` route to log in with an existing account.

3.  **Explore the Application:**
    -   **Home (`/`):** View the feed of posts from users you follow.
    -   **Explore (`/explore`):** Discover posts from other users.
    -   **Profile (`/profile/:id`):** View your profile and manage your posts.
    -   **User Profiles (`/user/:id`):** View other user profiles.
    -   **Settings (`/settings`):** Manage your profile and account settings.
    -   **Admin Dashboard (`/admin/dashboard/:id`):** (Admin Only) Manage users.

## File Structure

-   `public/`: Contains static assets such as `index.html` and images.
-   `src/`: Contains the source code for the React application.
    -   `src/App.js`: The main component of the application, defining the routing and layout.
    -   `src/components/`: Contains reusable React components.
    -   `src/contexts/`: Contains React context providers.
    -   `src/firebase/`: Contains Firebase configuration.
    -   `src/pages/`: Contains React components for different pages.
    -   `src/styles/`: Contains CSS style sheets.
    -   `src/utils/`: Contains utility functions and components.
    -   `src/index.js`: The entry point of the React application, rendering the main `App` component.

## Contributing Guidelines

Contributions are welcome! To contribute to React Slinkup, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Test your changes thoroughly.
5.  Submit a pull request with a clear description of your changes.

## License Information

This project has no license specified. All rights are reserved.

## Contact/Support Information

For questions or support, please contact the repository owner through GitHub.
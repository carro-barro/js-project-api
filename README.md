# Project API

render: https://happy-thoughts-api-o47r.onrender.com

# Happy Thoughts API

This project is a RESTful API built with **Node.js**, **Express**, and **MongoDB** (via Mongoose) that allows users to create, view, manage, and "like" happy thoughts. It also includes user authentication features to secure content management actions.

## 🚀 Key Features

*   **User Management:**
    *   **Signup:** Register new users with email, first name, last name, and hashed passwords (using `bcrypt`).
    *   **Login:** Authenticate users and receive an `accessToken` for protected requests.
*   **Happy Thoughts Management:**
    *   **Create:** Authenticated users can post happy thoughts.
    *   **Read:** View all thoughts (supports filtering by minimum likes) or fetch a specific thought by ID.
    *   **Update:** Authenticated users can edit their own thoughts.
    *   **Delete:** Authenticated users can delete their own thoughts.
    *   **Like:** Users can "like" (increment the heart count) any happy thought.
*   **Security:**
    *   Authentication middleware verifies user `accessToken` for sensitive operations (creating, updating, deleting).
    *   Authorization checks ensure users can only modify thoughts they own.
    *   Password hashing and email validation.

## 🛠 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Security:** `bcrypt` (password hashing), `crypto` (access token generation)
*   **Utilities:** `cors`, `dotenv` (environment variables), `express-list-endpoints`

## 📡 API Endpoints

### User Routes (`/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | No |
| `POST` | `/login` | Authenticate user | No |
| `GET` | `/:id` | Get user profile | No |

### Happy Thoughts Routes (`/happy-thoughts`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List thoughts (query: `minLikes`) | No |
| `POST` | `/` | Create a new thought | Yes |
| `GET` | `/:id` | Get a specific thought | No |
| `PATCH` | `/:id` | Update a thought | Yes |
| `DELETE` | `/:id` | Delete a thought | Yes |
| `PATCH` | `/:id/like` | Like a thought | No |

## ⚙️ Setup & Configuration

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root directory and define the following:
    ```text
    MONGO_URL=your_mongodb_connection_string
    ```
4.  **Run the server:**
    ```bash
    npm run dev
    ```
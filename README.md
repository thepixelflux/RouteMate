# RouteMate - Your Metro Commute Companion
**RouteMate** is a full-stack co-riding network designed for college students and daily transit commuters. Inspired by the clean and structured layout of the Delhi Metro Rail Corporation (DMRC) website, RouteMate helps users find route pools (cab-pooling, auto-sharing, or two-wheeler sharing), split daily commute costs, join campus/workplace networks, and coordinate trips via live group chats.

🖥️ **Live Client UI:** [https://routemate-wine.vercel.app/](https://routemate-wine.vercel.app/)  
⚙️ **Live Backend API:** [https://routemate-i35b.onrender.com](https://routemate-i35b.onrender.com)

## 🛠️ Tech Stack & Architecture
### **Frontend**
*   **React.js (Vite)** – High-performance Single Page Application (SPA).
*   **React Router Dom** – Client-side navigation and route management.
*   **React Context API** – Global session management and token persistence.
*   **Axios** – Configured API client with interceptors to automatically attach JSON Web Tokens (JWT).
*   **Vanilla CSS** – Structured layout, styling custom tables, buttons, and form inputs inspired by DMRC colors (Navy Blue, Crimson Red, Metro Yellow).
### **Backend**
*   **Node.js & Express.js** – Robust RESTful API server.
*   **MongoDB Atlas** – Cloud-hosted NoSQL database storing users, rides, communities, and message schemas.
*   **Mongoose** – Object Data Modeling (ODM) library for MongoDB validation and relationships.
*   **JWT (JSON Web Tokens)** – Stateless authentication and authorization guard.
*   **bcryptjs** – Secure hashing algorithms for user passwords.
### **Deployment **
*   **Vercel** – Hosting for the client SPA with dynamic rewriting for React Router paths.
*   **Render** – Web Service cloud hosting for the continuous Express server.
*   **Git & GitHub** – Version control and automated CD (Continuous Deployment) pipelines.

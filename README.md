# Mini LinkedIn-like Community Platform

A lightweight social feed web app built as a full-stack challenge for the CIAAN Cyber Tech internship.  
Features user authentication, posts, likes, comments, and profile pages. Responsive UI with polished login/register forms.

## 🔗 Live Demo

- **Frontend:** https://<your-frontend-domain>.vercel.app  <!-- replace with actual Vercel URL -->
- **Backend API:** https://mini-linkedin-backend-dz5f.onrender.com

## 🧰 Tech Stack

- **Frontend:** React, React Router  
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT (JSON Web Tokens)  
- **Styling:** Custom CSS (responsive, card-style forms)  
- **Deployment:** Vercel (frontend), Render (backend)

## ⭐ Features

### Required
- User registration & login (email + password) with JWT authentication  
- User profile with name, email, bio  
- Public feed showing text-only posts with author name (clickable to profile) and timestamp  
- Protected routes (only authenticated users can post, like, comment, view certain pages)

### Implemented Extras
- Create, edit, delete own posts  
- Like / unlike posts  
- Add and view comments on posts  
- Responsive, polished login & register UI with client-side validation (email format, password length, non-empty posts/comments)  
- Navigation bar with context-aware links (login/register if logged out, profile/logout when logged in)  
- Persistent session via localStorage  
- Profile page showing a user’s posts and allowing edits if it's your own  
- Centralized API base URL via environment variable for deployed backend  
- Demo user support and clear error messaging  

## 🛠 Local Development

### Prerequisites

- Node.js (v18+ recommended)  
- npm  
- MongoDB Atlas account (or local MongoDB, though env assumes Atlas)  

### Backend Setup

```bash
cd mini-linkedin-backend
npm install

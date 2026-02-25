> # Relay ⚡
>
> ### Global Real-Time Messaging Application
>
> Relay is a full-stack, real-time messaging platform inspired by WhatsApp.  
> It focuses on secure authentication, scalable backend design, and efficient real-time state management across a global network.
>
> ---
>
> ## 🎯 Objective
>
> Build a production-ready messaging system that supports:
>
> - Secure JWT-based authentication
> - Real-time 1-on-1 chat
> - Online / Last Seen presence
> - Typing indicators
> - Read receipts
> - Persistent chat history
> - Mobile-responsive UI
>
> ---
>
> ## 🛠 Tech Stack
>
> **Frontend:** React.js / Next.js + TypeScript  
> **Backend:** Node.js + Express  
> **Database:** MongoDB  
> **Real-time:** Socket.io
>
> ---
>
> ## ✨ Core Features
>
> ### 🔐 Authentication & Profiles
>
> - JWT-secured login
> - Profile setup (display name, about, avatar)
> - Searchable user discovery
>
> ### 💬 Real-Time Messaging
>
> - Instant message delivery via Socket.io
> - Room-based communication
> - Persistent chat storage
> - Chronological loading
> - Pagination / Infinite Scroll support
>
> ### 🟢 Advanced Chat States
>
> - Online / Last Seen indicators
> - Typing status
> - Read receipts
> - Message timestamps
> - Auto-scroll on new messages
>
> ---
>
> ## ⚡ Scalability & Security
>
> - Indexed MongoDB queries for fast retrieval
> - Room-specific socket broadcasting (no global emits)
> - Input sanitization to prevent XSS
> - Protected API routes using middleware
>
> ---
>
> ## 🌍 Deployment
>
> Frontend deployed on Vercel  
> Backend deployed on Render / Railway
>
> Test credentials provided in submission.
>
> ---
>
> Relay is built to demonstrate real-world system design, database modeling, and real-time architecture — not just UI cloning.

# 😂 MemeVerse – The Ultimate Meme Sharing Platform

MemeVerse is a **highly interactive meme-sharing platform** built using **Next.js**. It allows users to **explore, upload, and interact with memes** while offering features like **infinite scrolling, AI-generated captions, authentication, and a leaderboard**.

## 🚀 Live Demo  
🔗 [MemeVerse](https://persist-ventures-delta.vercel.app/)

---

## 📌 Features

### 🏠 Homepage  
- Displays **trending memes dynamically** (fetched from an API).  
- Smooth **animations and transitions** using **Framer Motion**.  
- **Dark mode toggle** for a better user experience.  

### 🔍 Meme Explorer  
- **Infinite scrolling** for a seamless browsing experience.  
- Filters for **Trending, New, Classic, and Random** memes.  
- **Search with debounce** for optimized API calls.  
- **Sorting options** (by likes, date, or comments).  

### 📤 Meme Upload  
- Upload **memes (images/GIFs)** with captions.  
- **AI-generated meme captions** using a meme-related API.  
- **Preview before uploading** for better user control.  

### 📄 Meme Details Page  
- Dynamic routing **(/meme/:id)** for meme-specific pages.  
- View **meme details, likes, comments, and sharing options**.  
- **Like button with animations and local storage persistence**.  
- **Comment system (stored in local storage for now)**.  

### 👤 User Profile  
- Displays **user-uploaded memes**.  
- Edit **profile info (Name, Bio, Profile Picture)**.  
- View **liked memes (saved in local storage or API)**.  

### 🏆 Leaderboard  
- **Top 10 most liked memes**.  
- **User rankings** based on engagement.  

### 🔥 Fun 404 Page  
- A **meme-based Easter Egg** when visiting a non-existent route.  

---

## 🛠️ Tech Stack  
- **Frontend & Backend**: Next.js  
- **Styling**: Tailwind CSS  
- **Animations**: Framer Motion  
- **State Management**: Context API  
- **Authentication & Authorization**: JWT, Cookies  
- **Data Storage**: MongoDB  
- **Meme API & AI Captions**: Custom backend integration  

---

## 🎯 Development Approach  

### 🔹 **Why Next.js?**  
Since the meme API lacked enough data, I built my own **backend with a database and authentication**. Next.js was the best choice for:  
- **SEO benefits** (for memes & user profiles).  
- **Server-side rendering (SSR) & static generation (SSG)** for performance.  
- **API routes for handling uploads & AI caption generation**.  

### 🔹 **Challenges & Solutions**  
✅ **Infinite Scrolling:** First time implementing it, faced issues with performance. Solved it using **Intersection Observer**.  
✅ **Performance Optimization:** Used **lazy loading, memoization, and code splitting** to improve load times.  

---

## 🏗️ Installation & Setup  

### 🔧 **Clone the Repository**  
```bash
git clone https://github.com/Jatin39-bit/persist_ventures.git
cd persist_ventures
📦 Install Dependencies
npm install

change database MONGO_URL, SECRET and IMGBB_API_KEY value in .env file

🚀 Run the Project
npm run dev
The app will be available at http://localhost:3000.

🤝 Contribution
Want to improve MemeVerse? Feel free to fork the repo, open issues, or submit PRs! 😊

✨ Made with ❤️ by Jatin

Let me know if you want any modifications! 🚀

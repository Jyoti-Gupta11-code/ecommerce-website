# 🚀 Deployment Guide: E-Commerce Platform

This guide provides simple, step-by-step instructions to manually deploy your full-stack E-Commerce platform to production:
- **Backend API:** Render (or any Node.js cloud platform like Railway / Heroku)
- **Customer Frontend:** Netlify
- **Admin Dashboard:** Netlify

---

## 📋 Architecture & Directory Overview

Your repository is structured as a monorepo containing three distinct subsystems:
- `/backend`: Node.js / Express REST API with MongoDB & Cloudinary integration
- `/frontend`: Customer-facing storefront (React + Vite + Tailwind CSS)
- `/Admin`: Admin management portal (React + Vite + Tailwind CSS)

---

## Part A: Deploy Backend API on Render

### 1. Create a Web Service
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `https://github.com/Jyoti-Gupta11-code/ecommerce-website.git`.

### 2. Configure Service Settings
| Field | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `ecommerce-backend` (or your choice) | Will form your URL: `https://<name>.onrender.com` |
| **Region** | Choose the closest region | e.g., Singapore, Frankfurt, Oregon |
| **Branch** | `main` | Production branch |
| **Root Directory** | `backend` | **Important:** Point directly to the `backend` folder |
| **Runtime** | `Node` | Node.js v18+ |
| **Build Command** | `npm install` | Installs dependencies |
| **Start Command** | `npm start` | Runs `node server.js` |

### 3. Add Backend Environment Variables
Under the **Environment Variables** tab on Render, add the following key-value pairs:

| Variable Name | Description | Example / Source |
| :--- | :--- | :--- |
| `PORT` | Server Port | `4000` (or leave default assigned by Render) |
| `MONGODB_URI` | MongoDB Atlas Connection String | `mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce` |
| `JWT_SECRET` | Secret key for signing tokens | Any strong random string |
| `ADMIN_EMAIL` | Admin login email | e.g. `admin@forever.com` |
| `ADMIN_PASSWORD` | Admin login password | Strong password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | From Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | From Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | From Cloudinary Dashboard |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | `sk_test_...` or live key from Stripe |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` or live key |
| `RAZORPAY_KEY_SECRET`| Razorpay Key Secret | From Razorpay Dashboard |
| `GEMINI_API_KEY` | Google Gemini API Key | From Google AI Studio |
| `FRONTEND_URL` | Deployed Frontend URL | Set this after Part B (e.g. `https://your-store.netlify.app`) |
| `ADMIN_URL` | Deployed Admin URL | Set this after Part C (e.g. `https://your-admin.netlify.app`) |

### 4. Deploy and Retrieve Backend URL
1. Click **Create Web Service**.
2. Wait for the build and deployment logs to say:
   ```text
   DB Connected
   Cloudinary Connected
   Server running on port 4000
   ```
3. Copy your live backend URL from the top of the Render dashboard (e.g., `https://ecommerce-backend.onrender.com`).
4. Test it in your browser: `https://your-backend.onrender.com/` should respond with:
   ```text
   API Working
   ```

---

## Part B: Deploy Customer Frontend on Netlify

### 1. Connect Repository
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize your repository: `ecommerce-website`.

### 2. Configure Build Settings
| Field | Value | Notes |
| :--- | :--- | :--- |
| **Base directory** | `frontend` | **Crucial:** Points Netlify to the customer app |
| **Build command** | `npm run build` | Builds Vite production bundle |
| **Publish directory** | `dist` | Contains the built static files and `_redirects` |

### 3. Add Environment Variables on Netlify
Go to **Site configuration** > **Environment variables** > **Add a variable**:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` | Your live backend URL from Part A (no trailing slash) |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` | Public Razorpay key ID |

*(Note: `VITE_API_URL` is also supported as an alias for `VITE_BACKEND_URL`)*

### 4. Deploy Site
1. Click **Deploy frontend**.
2. Netlify will build and deploy the app. Once finished, you will receive a site URL (e.g., `https://my-store.netlify.app`).
3. You can set a custom subdomain under **Site settings** > **Change site name**.

---

## Part C: Deploy Admin Dashboard on Netlify (Optional / Recommended)

If you wish to host the staff admin portal separately:

### 1. Create a Second Netlify Site
1. On Netlify, click **Add new site** > **Import an existing project** (same GitHub repo).
2. Set build settings:
   - **Base directory:** `Admin`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add Environment Variables:
   - `VITE_BACKEND_URL`: `https://your-backend.onrender.com`
4. Deploy the site to receive your admin URL (e.g., `https://my-store-admin.netlify.app`).

---

## Part D: Post-Deployment Verification & Testing

### 1. Link Frontend URLs to Backend CORS
Now that you have your live Netlify URLs:
1. Return to your **Render Backend Dashboard** > **Environment Variables**.
2. Update:
   - `FRONTEND_URL`: `https://my-store.netlify.app`
   - `ADMIN_URL`: `https://my-store-admin.netlify.app`
3. Click **Save Changes** (Render will automatically redeploy with the updated CORS policy).

### 2. Verification Checklist
- [ ] **API Health Check:** Visit `https://your-backend.onrender.com/` — should show `API Working`.
- [ ] **Product Catalog:** Open your frontend at `https://my-store.netlify.app/collection` — all products and images should render without console errors.
- [ ] **Client-Side Routing:** Navigate to `/about` or `/collection` and refresh the page (F5) — page must reload cleanly without a 404 error (handled by `_redirects`).
- [ ] **Customer Authentication:** Test registering a new user and logging in on `/login` — JWT token should save and update navbar state.
- [ ] **Cart Operations:** Add an item with size variant to cart and open `/cart` — verify item counts and totals update.
- [ ] **AI Assistant Widget:** Open voice assistant widget — verify Google Gemini intent endpoint `/api/ai/intent` responds.
- [ ] **Admin Portal:** Visit admin portal, log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`, verify inventory listing and order management.

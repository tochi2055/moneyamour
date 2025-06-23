

# 🚀 MoneyAmour – A Dockerized Next.js + Firebase App

**License:** MIT
**Tech Stack:** Next.js · Firebase · Docker · pnpm

---

## 🔍 Project Overview

**MoneyAmour** is a production-ready, Dockerized **Next.js** application powered by **Firebase** and optimized with **pnpm** for efficient dependency handling.

Built with scalability and developer convenience in mind, this project eliminates the need for manual local setup. Whether you’re building a dashboard, fintech MVP, or Firebase-powered web app, MoneyAmour is a great foundation.

---

## 🔧 Core Features

✅ **Next.js (App & Pages directory support)**
✅ **Firebase Integration** – Auth, Firestore, Hosting (Client SDK)
✅ **Dockerized Setup** – No local Node.js or pnpm installation required
✅ **pnpm Package Manager** – Faster installs, reduced disk usage
✅ **.env Support** – Easy credential management

---

## 📦 Prerequisites

Make sure you have the following installed:

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/) (included in Docker Desktop)

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/moneyamour.git
cd moneyamour
```

### 2. Create Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

## 🐳 Run the App with Docker

### Start the App

```bash
docker-compose up --build
```

Visit: [http://localhost:3000](http://localhost:3000)

### Stop the App

Press `Ctrl + C`, then:

```bash
docker-compose down
```

---

## 🐳 Helpful Docker Commands

```bash
# Rebuild after code or dependency changes
docker-compose up --build

# List running containers
docker ps

# Stop all containers
docker stop $(docker ps -q)
```

---

## 🖼️ Screenshots

| Landing Page                                                                          | Auth Flow                                                                             | Dashboard                                                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ![1](https://github.com/user-attachments/assets/35ee375f-2bae-4945-b828-f1d5894d9d4f) | ![2](https://github.com/user-attachments/assets/081227d0-9aff-4f88-b743-f4278faa80e1) | ![3](https://github.com/user-attachments/assets/5f0905b4-e0e7-4f59-833d-8c392c9b4cec) |
| ![4](https://github.com/user-attachments/assets/4cccbe0d-4d8e-4a2a-8cd7-fa84b05e8207) |                                                                                       |                                                                                       |

---

## 🔁 Contributing

We welcome community contributions! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: added X feature"`
4. Push your branch: `git push origin feat/your-feature`
5. Open a Pull Request for review

> For major changes, open an issue first to discuss your ideas.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Special thanks to:

* 🧠 **@amour**
* 💻 **@mosnyik**

---

## 🧠 FAQ

**Q: Can I run it without Docker?**
A: Yes — simply install `pnpm`, create `.env.local`, and run `pnpm install && pnpm dev`.

**Q: How do I integrate Firebase Admin SDK?**
A: Use `firebase-admin` on the server side and update Dockerfile + services accordingly.

**Q: Does this support Firebase Hosting?**
A: By default, it's local dev focused. You can deploy to Firebase Hosting, Vercel, or any Docker-ready platform.



# 🚀 Tech Shelf

<div align="center">
  <img src="public/images/tech-shelf-logo.png" alt="Tech Shelf Logo" width="200"/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-13.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Neon](https://img.shields.io/badge/Neon_DB-1.0-00FF9D?style=for-the-badge&logo=neon)](https://neon.tech/)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-000000?style=for-the-badge&logo=clerk)](https://clerk.com/)
</div>

## 📝 Overview

Tech Shelf is a modern blogging platform built by students from BMS College of Engineering, Department of Information Science. It provides a comprehensive space for tech enthusiasts to share their knowledge, experiences, and insights through well-crafted articles.

### ✨ Features

- 📱 **Real-time Analytics**: Track article performance with live statistics
- 💬 **Interactive Comments**: Engage with readers through a dynamic commenting system
- 🎨 **Rich Text Editor**: Create beautiful articles with React Quill
- 🔒 **Secure Authentication**: Powered by Clerk for robust user management
- 📊 **Dashboard**: Monitor your content's performance with detailed analytics
- 🌙 **Dark Mode**: Enjoy a comfortable reading experience in any lighting condition
- 📱 **Responsive Design**: Seamless experience across all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 13.4**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Beautiful UI components
- **React Quill**: Rich text editor
- **Recharts**: Interactive charts for analytics

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe ORM
- **Neon DB**: Serverless PostgreSQL database
- **Socket.io**: Real-time updates

### Authentication & Security
- **Clerk**: User authentication and management
- **NextAuth.js**: Session management
- **JWT**: Secure token handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Neon DB account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aniketh1/Tech-Shelf.git
   cd Tech-Shelf
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-neon-db-connection-string"

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key

   # Next Auth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000

   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up Neon Database**
   - Create an account at [Neon](https://neon.tech)
   - Create a new project
   - Get your connection string
   - Run Prisma migrations:
     ```bash
     npx prisma generate
     npx prisma db push
     ```

5. **Set up Clerk Authentication**
   - Create an account at [Clerk](https://clerk.com)
   - Create a new application
   - Get your API keys
   - Configure OAuth providers (optional)

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📁 Project Structure

```
Tech-Shelf/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   ├── articles/          # Article pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── dashboard/        # Dashboard components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/              # Static assets
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

- **Aniket V Korwar** - Information Science, BMS College of Engineering
- **Satvik K** - Information Science, BMS College of Engineering
- **Rohan R Navalyal** - Information Science, BMS College of Engineering

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Prisma](https://www.prisma.io/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

<div align="center">
  Made with ❤️ by BMS College of Engineering Students
</div>

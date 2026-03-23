# ⚗️ Chemical Reaction Visualizer

<div align="center">

**An interactive web application to visualize and explore chemical reactions with beautiful animations**

[![React](https://img.shields.io/badge/React-18.0+-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?logo=firebase)](https://firebase.google.com)
[![ESLint](https://img.shields.io/badge/ESLint-Enabled-green)](https://eslint.org)

</div>

---

## 🎯 Overview

Chemical Reaction Visualizer is an educational web application designed to help students and educators understand chemical reactions through interactive visualizations and animations. Explore the periodic table, visualize inorganic and organic reactions, and create custom reactions with ease.

## ✨ Features

- 🧪 **Interactive Periodic Table** - Explore elements with detailed information
- 🔄 **Reaction Visualization** - Watch chemical reactions animate in real-time
- 🧬 **Inorganic Reactions** - Browse and understand common inorganic chemistry reactions
- 🌿 **Organic Reactions** - Explore organic chemistry reactions and mechanisms
- 🛠️ **Custom Reaction Builder** - Create and test your own chemical reactions
- 🔐 **User Authentication** - Secure login with Firebase Authentication
- 🎨 **Beautiful Animations** - Smooth transitions and engaging visual effects
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Modern UI** - Clean, intuitive interface with excellent UX

## 🛠️ Tech Stack

- **Frontend Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS3 with custom animations
- **Authentication:** Firebase
- **Code Quality:** ESLint
- **Package Manager:** npm
- **Data Format:** JSON (for reactions and elements)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chemical-reaction-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (if needed)
   - Update Firebase configuration in `src/firebase/config.js`
   - Add your Firebase credentials

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📚 Usage

### Development
```bash
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Accessing the Application
- Development: `http://localhost:5173` (default Vite port)
- Production: Deploy the `dist` folder to your hosting platform

## 📁 Project Structure

```
chemical-reaction-visualizer/
├── src/
│   ├── components/          # React components
│   │   ├── Auth/           # Authentication pages
│   │   ├── common/         # Reusable components
│   │   ├── CustomReaction/ # Custom reaction builder
│   │   ├── Elements/       # Periodic table components
│   │   ├── Layout/         # Layout components
│   │   └── ReactionVisualizer/ # Reaction visualization
│   ├── pages/              # Page components
│   ├── context/            # React context
│   ├── firebase/           # Firebase configuration
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── assets/             # JSON data files
│   ├── styles/             # Global & animation styles
│   ├── App.jsx             # Root component
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## 🎨 Key Components

- **PeriodicTable** - Interactive periodic table with element details
- **ReactionVisualizer** - Main component for visualizing reactions
- **CustomReactionBuilder** - Tools for creating custom reactions
- **AuthPage** - User authentication and login
- **ReactionAnimation** - Handles reaction animations and effects

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |

## 📊 Data Files

Reaction and element data are stored as JSON in `src/assets/`:
- `elements.json` - Periodic table elements
- `inorganicReactions.json` - Inorganic chemistry reactions
- `organicReactions.json` - Organic chemistry reactions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- Vite for blazing fast development
- Firebase for authentication services
- Chemical industry resources for reaction data

---

<div align="center">

Made with ⚗️ by the Development Team

**Questions or suggestions?** Open an issue on GitHub!

</div>

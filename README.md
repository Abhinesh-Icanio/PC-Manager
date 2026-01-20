<<<<<<< HEAD
# PC-Manager
=======
# DCM Dashboard

A modern React dashboard built with Vite, TypeScript, Tailwind CSS, and Material-UI.

## Features

- **Dark Sidebar Navigation** - Elegant purple/indigo gradient sidebar with navigation
- **Key Metrics Cards** - Display Products, Rate Tables, Schedules, and Methodologies
- **Quick Actions** - Fast access to common operations
- **Active Management Schedules** - Real-time schedule monitoring with progress indicators
- **System Alerts & Insights** - Important system notifications and performance insights

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI (MUI)** - React component library
- **Emotion** - CSS-in-JS library (required by MUI)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard container
│   ├── Header.tsx             # Top header bar with search
│   ├── Sidebar.tsx            # Left navigation sidebar
│   └── sections/
│       ├── KeyMetrics.tsx     # Key metrics cards
│       ├── QuickActions.tsx   # Quick action buttons
│       ├── ActiveManagementSchedules.tsx  # Schedule cards
│       └── SystemAlerts.tsx   # Alert cards
├── App.tsx                    # Root component
├── main.tsx                   # Entry point
└── index.css                  # Global styles
```

## Customization

The dashboard is fully customizable. You can modify:
- Colors in Tailwind config (`tailwind.config.js`)
- Component styles in individual component files
- Data structure in section components
- Layout in `App.tsx` and `Dashboard.tsx`

## License

MIT
>>>>>>> e8e32e7 (Initial commit)

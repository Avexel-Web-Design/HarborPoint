# Birchwood Farms Golf & Country Club

A modern, elegant React website for Birchwood Farms Golf & Country Club built with Vite and Tailwind CSS.

## Features

- ⚡ Fast development with Vite
- 🎨 Beautiful, responsive design with Tailwind CSS
- 🌳 Custom Birchwood-themed logo and design elements
- 📱 Mobile-first responsive design
- 🎯 Scalable architecture for multiple pages
- 🚀 Optimized for performance

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Custom Logo** - SVG-based Birchwood logo

## Design System

### Colors
- **Primary Navy**: `#202c44` (primary-950)
- **White**: `#ffffff`
- **Accent Blues**: Various shades from primary-50 to primary-900

### Typography
- **Primary Font**: Crimson Text (serif) - for headings and elegant text
- **Secondary Font**: Inter (sans-serif) - for body text and UI elements

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Site footer
│   ├── sections/
│   │   ├── Hero.jsx        # Homepage hero section
│   │   ├── Welcome.jsx     # Welcome/about section
│   │   ├── Features.jsx    # Features showcase
│   │   └── CallToAction.jsx # CTA section
│   └── ui/
│       └── BirchwoodLogo.jsx # Custom SVG logo
├── pages/
│   └── Home.jsx            # Homepage
├── App.jsx                 # Main app component
├── main.jsx               # App entry point
└── index.css              # Global styles and Tailwind imports
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Future Pages Structure

The application is structured to easily accommodate additional pages:

- `/golf` - Golf course information
- `/dining` - Restaurant and dining options
- `/events` - Event hosting and weddings
- `/membership` - Membership information
- `/about` - Club history and staff
- `/contact` - Contact information and forms

To add a new page:
1. Create the page component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/components/layout/Header.jsx`

## Customization

### Adding New Sections
Create new section components in `src/components/sections/` and import them into the relevant page.

### Modifying Colors
Update the color palette in `tailwind.config.js` under the `theme.extend.colors` section.

### Adding Fonts
Add new font imports to `index.html` and update the font family in `tailwind.config.js`.

## Deployment

Build the production version:
```bash
npm run build
```

The `dist/` folder will contain the optimized build ready for deployment to any static hosting service.

## License

Private project for Birchwood Farms Golf & Country Club.

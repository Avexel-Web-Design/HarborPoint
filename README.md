# HarborPoint

A modern React + Cloudflare Pages template for the HarborPoint project (frontend placeholder; backend APIs with D1 database).

## Features

- ⚡ Fast development with Vite
- 🎨 Beautiful, responsive design with Tailwind CSS
- � HarborPoint-themed design elements (placeholder)
- 📱 Mobile-first responsive design
- 🎯 Scalable architecture for multiple pages
- 🚀 Optimized for performance
- 🔐 **Member Login System** - Secure member portal with authentication
- 🏌️ **Member Dashboard** - Exclusive member-only features and content
- 💾 **Cloudflare Integration** - D1 database and Workers for backend functionality

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Custom Logo** - SVG-based Birchwood logo
- **Cloudflare Pages** - Static site hosting and deployment
- **Cloudflare Workers** - Serverless functions for API endpoints
- **Cloudflare D1** - SQLite-compatible database for member data (see `BACKEND_SETUP.md`)
- **JWT Authentication** - Secure member login system

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
- `/members/login` ✅ - Member authentication
- `/members/dashboard` ✅ - Member portal and dashboard
- `/members/profile` ✅ - Member profile management
- `/members/events` ✅ - Member events and activities
- `/members/tee-times` ✅ - Golf tee time booking system

To add a new page:
1. Create the page component in `src/pages/`
2. Add the route to `src/App.jsx`
3. Update navigation in `src/components/layout/Header.jsx`

## Member System

The website includes a complete member login and portal system with online amenities:

### 🔐 **Development Credentials**
For testing and development, use these login credentials:

Example seeded dev credentials (update as needed after schema load):

Member Login: `/members/login`
- Email: `member@example.com` (create via registration if not seeded)
- Password: (set on creation)

Admin Login: `/admin/login`
- Username: `admin` (default from schema)
- Password: `admin123` (SHA-256 hash in schema, change in production)

See [DEV_CREDENTIALS.md](./DEV_CREDENTIALS.md) for complete development setup information.

### 🏌️ **Member Features**
- **Tee Time Booking** - Online golf tee time reservations
- **Dining Reservations** - Restaurant table bookings
- **Guest Pass Management** - Generate QR code guest passes
- **Event Registration** - Club event sign-ups
- **Profile Management** - Account settings and preferences

### 👔 **Admin Features**
- **Member Management** - Full CRUD operations for member accounts
- **System Administration** - User status and permissions
- **Reporting** - Member statistics and activity reports

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

Private project for HarborPoint.

# Desert Sports Med

A professional website for Desert Sports Med, providing quality medical coverage for athletes and sporting events.

## 🎨 NEW: Visual Editor - Edit Your Site Like Wix!

Your entire website now has **TWO powerful editing modes**! Edit every page, component, and style without coding - just like Wix, Webflow, or Squarespace.

### 🚀 Quick Start

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Click the **purple Settings button** (⚙️) on any page
4. Choose your editing mode and start editing!

### ✨ Two Editing Modes

#### 1. Quick Edit (In-Place Editor) - RECOMMENDED
**Perfect for editing your existing content:**
- ✅ Edit text directly on the page
- ✅ Change font size with sliders
- ✅ Adjust colors instantly
- ✅ **Drag elements** to move them
- ✅ **Resize with handles**
- ✅ Each element edits independently (no more accidental global changes!)
- ✅ Real-time preview
- ✅ User-friendly UI

**Use for:** Text updates, font changes, color tweaks, repositioning elements

#### 2. Page Builder (Full Editor)
**Perfect for building new pages from scratch:**
- ✨ Drag & drop pre-built components
- 📱 Responsive design tools (desktop/tablet/mobile)
- 💾 Auto-save functionality
- 📤 Export pages as HTML
- 🎯 Component library (hero sections, forms, testimonials, etc.)
- 🔧 Custom code blocks

**Use for:** Complete redesigns, new pages, complex layouts

### 📚 Documentation
- **QUICK_EDITOR_GUIDE.md** - Start here! Quick reference & tutorial
- **IN_PLACE_EDITOR_GUIDE.md** - Detailed in-place editor guide
- **VISUAL_EDITOR_GUIDE.md** - Full page builder documentation
- **README_VISUAL_EDITOR.md** - Complete overview
- **Admin Panel:** Navigate to `/admin/editor` to manage all pages

---

## About

Desert Sports Med provides professional and certified athletic trainers for comprehensive medical coverage at sporting events. We offer trusted care for athletes, teams, and events.

## Development

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Getting Started

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd DSM

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The development server will start with auto-reloading and an instant preview.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets (images, etc.)
```

## Deployment

Build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Trainer Auth (Appwrite)

Set the following environment variables in a `.env` file (Vite):

```
VITE_APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
```

Pages included:
- `/trainer/login` – Secure login for Athletic Trainers
- `/trainer/register` – Account creation with email verification and strong password requirements
- `/trainer/forgot` – Initiate password recovery; sends a temporary reset link
- `/verify-email` – Handles email verification callback
- `/reset-password` – Handles password reset callback and enforces password strength

Security features:
- Lockout after multiple failed login attempts (client-side UI lock for 15 minutes)
- Session timeout notifications with auto-logout on inactivity
- Email verification enforced post-registration

To enable a simple gate prompt for the AT Portal, set:

```
VITE_AT_PORTAL_GATE_ENABLED=true
VITE_AT_PORTAL_GATE_CODE=demo
```

### Appwrite MCP
If you use Appwrite MCP in your IDE, you can manage users and verify flows directly. See Appwrite MCP docs for setup and examples.

## Visual Editor

### ✨ What's New - FIXED: Per-Element Editing

**Problem Solved:** When you edit one button or element, only THAT specific element changes - not all elements of the same type!

Each element now gets a unique ID, so your changes are isolated and precise.

### Making Pages Editable

Every page on your site can be edited visually. The visual editor is already enabled on:
- ✅ Home page (`/`)
- ✅ About page (`/about`)
- ✅ AT Portal (`/at-portal`)
- ✅ Coverage Report (`/coverage-report`)
- ✅ Timesheet (`/timesheet`)
- ✅ Event Schedule (`/event-schedule`)
- ✅ Contact Coordinator (`/contact-coordinator`)

### How to Use

1. Navigate to any page
2. Click the **purple Settings button** (⚙️) in the bottom-right corner
3. Choose your editing mode:
   - **Quick Edit** - Edit existing content in-place (drag, resize, style)
   - **Page Builder** - Build complete pages from scratch

### Quick Edit Features

- 🎯 **Click any text** to edit it directly
- 🎨 **Adjust styles** with user-friendly sliders
- 🖱️ **Drag elements** to reposition them anywhere
- 📏 **Resize with handles** - grab corners to resize
- 🎭 **Per-element changes** - edit one thing without affecting others
- 💾 **Save changes** - persist across page reloads
- ⚡ **Real-time preview** - see changes instantly

### Example: Edit Hero Heading

To change "QUALITY MEDICAL COVERAGE..." text:
1. Click Settings (⚙️) → Quick Edit
2. Click the large heading
3. Adjust Font Size slider (try 60px)
4. Change Font Weight to Bold (700)
5. Adjust Letter Spacing if desired
6. Click "Save All Changes"
7. Done! Only that heading changed. ✨

### Admin Panel

Access the admin panel at `/admin/editor` to:
- View all editable pages in one dashboard
- Quick edit or preview any page
- Export/import pages for backup
- Reset pages to default
- View editing statistics

### Configuration

Editor access is controlled in `src/App.tsx`:

```typescript
// Enable in development only (current setting)
const enableEditing = import.meta.env.DEV;

// Enable for everyone
const enableEditing = true;

// Enable for admins only
const { user } = useAuth();
const enableEditing = user?.role === 'admin';
```

### Documentation Guide

Start with these files in order:
1. **QUICK_EDITOR_GUIDE.md** - Quick start & common tasks (READ THIS FIRST!)
2. **IN_PLACE_EDITOR_GUIDE.md** - Detailed in-place editor features
3. **VISUAL_EDITOR_GUIDE.md** - Full page builder documentation
4. **README_VISUAL_EDITOR.md** - Complete feature overview

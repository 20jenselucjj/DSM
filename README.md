# Desert Sports Med

A professional website for Desert Sports Med, providing quality medical coverage for athletes and sporting events.

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

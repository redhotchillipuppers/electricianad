# CLAUDE.md - AI Assistant Development Guide

**Project**: AMPALIGN - Electrical Services Platform (Lincolnshire)
**Last Updated**: 2025-11-14
**Status**: Active Development

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Firebase Integration](#firebase-integration)
7. [Component Architecture](#component-architecture)
8. [Styling Guidelines](#styling-guidelines)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Process](#deployment-process)
11. [Common Tasks](#common-tasks)
12. [Critical Considerations](#critical-considerations)

---

## Project Overview

AMPALIGN is a web platform connecting customers with electrical service providers in Lincolnshire. The application features:

- **Customer-facing landing page** with service showcase and quote request form
- **Service provider application portal** for electricians to join the network
- **Admin dashboard** for managing quotes and provider applications
- **Email notification system** via Cloud Functions
- **File upload capabilities** for project photos and certifications

### Key Features
- Multi-section quote request form with file uploads
- Interactive service area map
- Admin authentication and role-based access control
- Real-time data with Firebase Firestore
- Email notifications via Namecheap SMTP

---

## Tech Stack

### Frontend
- **React 19.0.0** - Latest version with concurrent features
- **TypeScript** - Type-safe component development
- **Vite 6.3.2** - Build tool and dev server
- **React Router 7.7.0** - Client-side routing
- **Tailwind CSS 4.1.4** - Utility-first styling
- **Lucide React** - Icon library
- **AOS** - Scroll animations

### Backend
- **Firebase**:
  - Authentication (email/password for admin)
  - Firestore (NoSQL database)
  - Cloud Storage (file uploads)
  - Cloud Functions (email triggers)
  - Hosting (static site deployment)
- **Node.js 22** - Cloud Functions runtime
- **Nodemailer** - Email delivery via SMTP

### Development Tools
- ESLint - Code linting (minimal config)
- Autoprefixer - CSS vendor prefixes
- PostCSS - CSS processing

---

## Repository Structure

```
/home/user/electricianad/
├── src/
│   ├── components/         # Landing page components (6 files)
│   │   ├── HeaderBanner.tsx    # Hero section (495 lines)
│   │   ├── Services.tsx        # Service showcase (493 lines)
│   │   ├── QuoteForm.tsx       # Customer quote form (949 lines)
│   │   ├── HowItWorks.tsx      # Process explanation (380 lines)
│   │   ├── ServiceAreaMap.tsx  # Interactive map (728 lines)
│   │   └── ServiceProviderForm.tsx  # Provider application (1200 lines)
│   ├── admin/              # Admin dashboard system (2,293 lines)
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx   # Main dashboard UI
│   │   │   ├── AdminLogin.tsx       # Auth login page
│   │   │   ├── ProtectedRoute.tsx   # Route guard
│   │   │   ├── QuoteRequestModal.tsx
│   │   │   └── ServiceProviderModal.tsx
│   │   └── utils/
│   │       └── adminAuth.ts         # Auth utilities
│   ├── firebase/           # Firebase configuration
│   │   ├── firebase.ts             # Singleton init pattern
│   │   └── submitQuote.ts          # Quote submission logic
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main app component (routing)
│   ├── main.jsx            # Entry point
│   ├── App.css             # Global styles
│   └── index.css           # Tailwind directives
│
├── functions/              # Cloud Functions
│   ├── index.js            # Email notification triggers
│   └── emailConfig.js      # SMTP and template config
│
├── public/                 # Static assets
├── dist/                   # Build output (gitignored)
│
├── firebase.json           # Firebase project config
├── storage.rules           # Cloud Storage security rules
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables (gitignored)
```

### Critical Files

**Entry Points:**
- `/src/main.jsx` - Application bootstrap
- `/src/App.jsx` - Routing configuration

**Firebase Setup:**
- `/src/firebase/firebase.ts` - Singleton Firebase initialization
- `/src/firebase/submitQuote.ts` - Quote submission with file upload

**Admin System:**
- `/src/admin/components/AdminDashboard.tsx` - Main admin interface
- `/src/admin/utils/adminAuth.ts` - Authentication helpers

**Cloud Functions:**
- `/functions/index.js` - Email triggers (quote + provider submissions)
- `/functions/emailConfig.js` - SMTP credentials and templates

**Configuration:**
- `/firebase.json` - Hosting, Functions, Storage, Emulators
- `/vite.config.js` - React + Tailwind plugins
- `/.env` - Firebase credentials (VITE_FIREBASE_*)

---

## Development Workflows

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd electricianad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Then fill in Firebase credentials

# Run development server
npm run dev
```

### Development Server

```bash
# Start Vite dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Firebase Emulators (Local Testing)

```bash
# Start emulators (Functions:5001, Firestore:8080, UI:4000)
firebase emulators:start

# Run functions shell for debugging
firebase functions:shell
```

### Git Workflow

**Branch Naming Convention:**
- Feature branches: `claude/feature-name-<session-id>`
- Always include session ID in branch name
- Example: `claude/create-codebase-documentation-01WTQF4HcGjx7zukA885b739`

**Commit Messages:**
- Use conventional commits format
- Examples:
  - `feat: Add provider verification system`
  - `fix: Resolve file upload security rules`
  - `docs: Update CLAUDE.md with deployment steps`
  - `refactor: Extract form validation to utility function`

**Push Protocol:**
```bash
# Always use -u flag for first push
git push -u origin <branch-name>

# Retry with exponential backoff on network failures
# (2s, 4s, 8s, 16s)
```

### Deployment Process

**Hosting (Frontend):**
```bash
# Build production assets
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

**Cloud Functions:**
```bash
# Deploy functions only
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendQuoteEmail
```

---

## Code Conventions

### File Naming
- **Components**: PascalCase (e.g., `QuoteForm.tsx`, `AdminDashboard.tsx`)
- **Utilities**: camelCase (e.g., `adminAuth.ts`, `submitQuote.ts`)
- **TypeScript**: Prefer `.tsx` for components, `.ts` for utilities
- **JavaScript**: Use `.jsx` for components (legacy), avoid for new files

### TypeScript Patterns

**Component Props:**
```typescript
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;  // Optional props with ?
}

const Component: React.FC<ComponentProps> = ({ title, onSubmit, isLoading = false }) => {
  // Implementation
};
```

**Firebase Types:**
```typescript
import { getFirebase } from './firebase/firebase';

const { db, storage, auth } = getFirebase();  // Singleton pattern
```

### State Management

**Component-level hooks (no Redux/Zustand):**
```typescript
const [formData, setFormData] = useState<FormData>({
  name: '',
  email: '',
  phone: ''
});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Form Validation

**Client-side validation pattern:**
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

const validateField = (field: string, value: string): boolean => {
  switch (field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Invalid email' }));
        return false;
      }
      break;
    // ... other validations
  }
  setErrors(prev => {
    const next = { ...prev };
    delete next[field];
    return next;
  });
  return true;
};
```

### Error Handling

**Try-catch with user feedback:**
```typescript
try {
  await submitQuote(formData);
  setSuccess(true);
} catch (error) {
  console.error('Submission failed:', error);
  setError('Failed to submit quote. Please try again.');
}
```

### Function Naming
- Event handlers: `handleClick`, `handleChange`, `handleSubmit`
- Data fetchers: `fetchQuotes`, `getProviders`, `loadData`
- Validation: `validateEmail`, `validatePhone`, `checkRequired`
- State setters: `setFormData`, `setLoading`, `setError`

---

## Firebase Integration

### Initialization Pattern

**Singleton to prevent re-initialization:**
```typescript
// src/firebase/firebase.ts
let services: FirebaseServices | null = null;

export function getFirebase(): FirebaseServices {
  if (services) return services;

  const app = getApps().length > 0
    ? getApps()[0]
    : initializeApp({ /* config */ });

  services = {
    app,
    db: getFirestore(app),
    storage: getStorage(app),
    auth: getAuth(app)
  };
  return services;
}
```

### Firestore Collections

**quotes** (Customer Requests)
```typescript
{
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  description: string;
  urgency: 'urgent' | 'week' | 'month';
  photoUrls: string[];  // Cloud Storage URLs
  submittedAt: Timestamp;
  status: 'new' | 'reviewed' | 'assigned' | 'completed';
}
```

**serviceProviders** (Provider Applications)
```typescript
{
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  certifications: string[];  // URLs to uploaded certs
  serviceAreas: string[];
  experience: string;
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
}
```

**users** (Admin Accounts)
```typescript
{
  email: string;
  role: 'admin' | 'superadmin';
  createdAt: Timestamp;
}
```

### File Upload Pattern

```typescript
import { getFirebase, ref, uploadBytes, getDownloadURL } from './firebase/firebase';

const uploadFile = async (file: File, path: string): Promise<string> => {
  const { storage } = getFirebase();
  const fileRef = ref(storage, path);

  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  return url;
};
```

### Environment Variables

**Required in `.env`:**
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Component Architecture

### Landing Page Components

**HeaderBanner.tsx** (src/components/HeaderBanner.tsx:1)
- Hero section with gradient background
- Customer testimonials
- CTA button to quote form
- Lines: 495

**Services.tsx** (src/components/Services.tsx:1)
- Service category cards
- Icons from Lucide React
- Grid layout with hover effects
- Lines: 493

**QuoteForm.tsx** (src/components/QuoteForm.tsx:1)
- Multi-section form (personal info, service details, photos)
- File upload with preview
- Client-side validation
- Firebase submission with Cloud Storage
- Lines: 949 (largest component)

**HowItWorks.tsx** (src/components/HowItWorks.tsx:1)
- 4-step process explanation
- Number indicators with connecting lines
- Lines: 380+

**ServiceAreaMap.tsx** (src/components/ServiceAreaMap.tsx:1)
- Interactive coverage map
- Clickable regions
- Lines: 728+

**ServiceProviderForm.tsx** (src/components/ServiceProviderForm.tsx:1)
- Provider application form
- Certification file uploads
- Service area selection
- Lines: 1200+ (second largest)

### Admin Components

**AdminDashboard.tsx** (src/admin/components/AdminDashboard.tsx:1)
- Tab-based interface (Overview, Providers, Quotes)
- Data tables with modals
- Real-time Firestore listeners
- Status update functionality

**AdminLogin.tsx** (src/admin/components/AdminLogin.tsx:1)
- Email/password authentication
- Error handling
- Redirect on success

**ProtectedRoute.tsx** (src/admin/components/ProtectedRoute.tsx:1)
- Auth guard wrapper
- Redirect to login if unauthenticated
- Loading states

**Modals:**
- `QuoteRequestModal.tsx` - View quote details
- `ServiceProviderModal.tsx` - Review provider applications

### Routing Structure

```jsx
// src/App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/providers" element={<ServiceProviderForm />} />
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

---

## Styling Guidelines

### Tailwind CSS 4

**Primary Colors:**
- Yellow accent: `#FFD300`
- Dark background: `#0A0A0A`, `#1A1A1A`
- Text: `#FFFFFF` (white), `#A0A0A0` (gray)

**Common Patterns:**
```tsx
// Card with hover effect
<div className="bg-[#1A1A1A] p-6 rounded-lg hover:bg-[#2A2A2A] transition">

// Yellow accent button
<button className="bg-[#FFD300] text-black px-6 py-3 rounded-lg hover:bg-[#E6C000]">

// Gradient background
<div style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)' }}>
```

### Inline Styles vs Tailwind

**When to use inline styles:**
- Complex gradients
- Dynamic values from state
- One-off custom animations

**When to use Tailwind:**
- Standard spacing, colors, typography
- Responsive design
- Hover/focus states

### Design System

**Typography:**
- Headings: `text-4xl font-bold`, `text-3xl font-semibold`
- Body: `text-base`, `text-lg`
- Small: `text-sm text-gray-400`

**Spacing:**
- Section padding: `py-16 px-8`
- Component margin: `mb-8`, `mt-12`
- Grid gaps: `gap-6`, `gap-8`

**Responsive:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Testing Strategy

### Current State
- **No automated tests** currently implemented
- Manual testing in development
- Firebase emulators for local testing

### Recommended Setup (Future)

**Unit Tests:**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```typescript
// src/components/__tests__/QuoteForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import QuoteForm from '../QuoteForm';

test('validates email field', () => {
  render(<QuoteForm />);
  const emailInput = screen.getByLabelText(/email/i);

  fireEvent.change(emailInput, { target: { value: 'invalid' } });
  fireEvent.blur(emailInput);

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});
```

**E2E Tests (Recommended):**
- Playwright or Cypress
- Test quote submission flow
- Test admin authentication
- Test provider application

---

## Deployment Process

### Pre-Deployment Checklist

- [ ] Environment variables set in `.env`
- [ ] Firebase project created/selected
- [ ] Storage rules configured (fix `allow: if false` issue)
- [ ] Firestore security rules deployed
- [ ] Cloud Functions SMTP credentials configured
- [ ] Admin user created in Firebase Auth
- [ ] Test email notifications
- [ ] Run production build (`npm run build`)
- [ ] Test production build (`npm run preview`)

### Production Deployment

**Step 1: Build Frontend**
```bash
npm run build
# Output: dist/ directory
```

**Step 2: Deploy to Firebase**
```bash
# First time setup
firebase login
firebase use --add  # Select project

# Deploy
firebase deploy

# Or deploy selectively
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only storage
```

**Step 3: Verify Deployment**
- Check hosting URL (from Firebase console)
- Test quote submission
- Test provider application
- Verify email delivery
- Check admin login

### Environment-Specific Configuration

**Development:**
- Use Firebase emulators
- `.env` with dev Firebase project

**Production:**
- Real Firebase project
- Production SMTP credentials
- Analytics enabled
- Error monitoring (recommended: Sentry)

---

## Common Tasks

### Adding a New Component

```bash
# Create component file
touch src/components/NewComponent.tsx

# Template:
```typescript
import React from 'react';

interface NewComponentProps {
  title: string;
}

const NewComponent: React.FC<NewComponentProps> = ({ title }) => {
  return (
    <div className="p-6 bg-[#1A1A1A] rounded-lg">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
  );
};

export default NewComponent;
```

### Adding a Firestore Collection

```typescript
// 1. Create interface
interface NewCollection {
  field1: string;
  field2: number;
  createdAt: Timestamp;
}

// 2. Write data
import { getFirebase, collection, doc, setDoc } from '@/firebase/firebase';

const addDocument = async (data: NewCollection) => {
  const { db } = getFirebase();
  const docRef = doc(collection(db, 'newCollection'));
  await setDoc(docRef, data);
};

// 3. Read data
import { getDocs } from '@/firebase/firebase';

const fetchDocuments = async () => {
  const { db } = getFirebase();
  const querySnapshot = await getDocs(collection(db, 'newCollection'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

### Adding a Cloud Function

```javascript
// functions/index.js
exports.newFunction = functions.firestore
  .document('collection/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Your logic here
    console.log('New document created:', data);
  });
```

### Updating Styling

```tsx
// 1. Check existing Tailwind classes
// 2. Add new utility classes
<div className="bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors duration-200">

// 3. For complex styles, use inline
<div style={{
  background: 'linear-gradient(135deg, #FFD300 0%, #E6C000 100%)',
  boxShadow: '0 4px 20px rgba(255, 211, 0, 0.3)'
}}>
```

### Debugging Firebase Issues

```typescript
// Enable verbose logging
import { getFirebase } from '@/firebase/firebase';

const { db, storage, auth } = getFirebase();

// Test connection
try {
  const testDoc = await getDoc(doc(db, 'test', 'test'));
  console.log('Firestore connected:', testDoc.exists());
} catch (error) {
  console.error('Firestore error:', error);
}

// Test auth
auth.onAuthStateChanged(user => {
  console.log('Auth state:', user ? user.email : 'Not authenticated');
});
```

---

## Critical Considerations

### Security Issues (MUST FIX)

**1. Cloud Storage Rules (CRITICAL)**
```
// Current (storage.rules):
allow read, write: if false;  // ❌ Blocks ALL uploads

// Fix needed:
allow read: if true;
allow write: if request.auth != null
  && request.resource.size < 10 * 1024 * 1024  // 10MB limit
  && request.resource.contentType.matches('image/.*|application/pdf');
```

**2. Firestore Security Rules (MISSING)**
- Currently using test mode (public read/write)
- Add production rules before deployment

**Example Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quotes/{quoteId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;  // Public can submit
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    match /serviceProviders/{providerId} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow create: if true;  // Public can apply
      allow update, delete: if request.auth != null && request.auth.token.admin == true;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**3. Input Sanitization (MISSING)**
- Forms submit directly to Firestore
- No backend validation
- Risk: XSS, injection attacks

**Recommended Fix:**
```typescript
// Add validation in Cloud Functions
exports.validateQuote = functions.https.onCall((data, context) => {
  // Sanitize inputs
  const sanitizedData = {
    name: data.name.replace(/[<>]/g, ''),  // Remove HTML tags
    email: data.email.toLowerCase().trim(),
    // ... more sanitization
  };

  // Validate
  if (!isValidEmail(sanitizedData.email)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid email');
  }

  return sanitizedData;
});
```

### Performance Considerations

**Large Components:**
- `QuoteForm.tsx` (949 lines) - Consider splitting into sections
- `ServiceProviderForm.tsx` (1200 lines) - Extract sub-components

**Optimization Tips:**
```typescript
// Memoize expensive computations
import { useMemo } from 'react';

const filteredProviders = useMemo(
  () => providers.filter(p => p.status === 'approved'),
  [providers]
);

// Lazy load admin routes
const AdminDashboard = React.lazy(() => import('./admin/components/AdminDashboard'));
```

### Known Issues

1. **App.jsx needs TypeScript conversion** (src/App.jsx:1)
   - Should be `App.tsx` for consistency

2. **Email configuration incomplete** (functions/emailConfig.js:1)
   - Update company details
   - Add real SMTP credentials

3. **No pagination in admin tables**
   - Will slow down with many quotes/providers

4. **No error boundaries**
   - App crashes on component errors
   - Add React error boundaries

5. **No loading states for data fetching**
   - Admin dashboard doesn't show loading spinners

### Migration Notes (TypeScript)

**Converting JSX to TSX:**
```typescript
// Before (App.jsx)
function App() {
  return <div>...</div>;
}

// After (App.tsx)
const App: React.FC = () => {
  return <div>...</div>;
};

export default App;
```

---

## Best Practices for AI Assistants

### When Making Changes

1. **Always read files before editing**
   - Use Read tool to understand current implementation
   - Check for dependencies and imports

2. **Maintain TypeScript consistency**
   - Add proper types for all new code
   - Don't use `any` types
   - Follow existing interface patterns

3. **Preserve existing patterns**
   - Follow singleton pattern for Firebase
   - Use same state management approach
   - Match existing naming conventions

4. **Test locally before committing**
   - Run `npm run dev` to verify changes
   - Check browser console for errors
   - Test Firebase integration with emulators

5. **Security first**
   - Never commit `.env` files
   - Always validate user inputs
   - Use Firebase security rules

### When Adding Features

1. **Check existing components first**
   - Reuse existing patterns
   - Extract shared logic to utilities
   - Don't duplicate code

2. **Update this documentation**
   - Add new components to structure section
   - Document new conventions
   - Update common tasks if applicable

3. **Consider Firebase costs**
   - Minimize Firestore reads
   - Use pagination for large datasets
   - Optimize Cloud Functions execution time

### When Debugging

1. **Check Firebase console first**
   - Verify data structure in Firestore
   - Check Cloud Storage file uploads
   - Review Cloud Functions logs

2. **Use browser DevTools**
   - Console for JavaScript errors
   - Network tab for Firebase calls
   - Application tab for auth state

3. **Enable emulators for testing**
   - Faster iteration
   - No production data corruption
   - Better debugging tools

---

## Resources

### Documentation Links
- [React 19 Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Firebase Setup
- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Data Model](https://firebase.google.com/docs/firestore/data-model)
- [Cloud Functions](https://firebase.google.com/docs/functions)
- [Security Rules](https://firebase.google.com/docs/rules)

### Project Contacts
- Repository: `redhotchillipuppers/electricianad`
- Main Branch: `main` (currently unset - use `master` or check git config)
- Development Branch: `claude/create-codebase-documentation-01WTQF4HcGjx7zukA885b739`

---

## Changelog

### 2025-11-14 - Initial Documentation
- Created comprehensive CLAUDE.md
- Documented entire codebase structure
- Identified critical security issues
- Established code conventions
- Added deployment workflows

---

**Note to AI Assistants**: This document is your primary reference for understanding and working with this codebase. Always refer to this before making significant changes. Keep this document updated as the project evolves.

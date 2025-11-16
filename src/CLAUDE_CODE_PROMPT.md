# Comprehensive Provider Authentication Implementation Prompt for Claude Code

## Context
I have an electrical services platform (Ampalign) built with React, TypeScript, Firebase, and React Router. The platform has:
- A quote request system where customers submit electrical work requests
- A service provider application system where electricians can apply to join the network
- An admin dashboard where administrators review and approve/reject service provider applications
- Admin authentication is already implemented and working

## Current State
- Service providers can fill out an application form at `/providers`
- Applications are stored in Firestore `serviceProviders` collection with `status: "pending"`
- Admins can approve/reject applications in the admin dashboard
- Provider login UI exists at `/provider-login` but authentication is not implemented
- There is NO account creation flow for approved providers

## Goal
Implement a complete authentication system for service providers that includes:
1. Account creation for approved providers
2. Login functionality
3. Protected routes for provider dashboard
4. Integration with existing Firebase setup
5. Proper security rules

## Files to Create

### 1. `/src/provider/utils/providerAuth.ts`
Create the provider authentication utility with these functions:
- `checkEmailApproved(email: string)` - Check if email exists in serviceProviders with status='approved'
- `checkProviderAccountExists(email: string)` - Check if user account already exists for email
- `createProviderAccount(email, password)` - Create Firebase Auth account + user document (role: 'provider')
- `signInProvider(email, password, rememberMe)` - Sign in and verify provider role and status
- `signOutProvider()` - Sign out current user
- `onProviderAuthStateChanged(callback)` - Listen to auth state
- `getCurrentProviderUser()` - Get current authenticated provider

Key requirements:
- When creating account, verify email is in approved serviceProviders
- Link created user to serviceProviders document via `providerId` field
- Update serviceProviders doc with `accountCreated: true`, `userId`, and `accountCreatedAt`
- Validate provider status is 'active' during login
- Handle all Firebase auth errors with user-friendly messages

### 2. `/src/provider/components/ProviderAccountCreation.tsx`
Create the account creation UI component with:
- Email input (can be pre-filled from URL param `?email=`)
- Real-time email validation showing if email is approved
- Display provider name if email is approved
- Show error if email already has an account
- Password input with strength indicator (weak/fair/strong)
- Confirm password input with match indicator
- Visual feedback for all validation states
- Disable submit if email not approved or account exists
- Success message and redirect to login after account creation
- Links to login page and provider application page
- Same dark theme/styling as existing login pages

### 3. `/src/provider/pages/ProviderAccountCreationPage.tsx`
Simple wrapper component that:
- Uses the ProviderAccountCreation component
- Handles navigation after successful account creation
- Redirects to `/provider-login` after success

### 4. `/src/provider/components/ProtectedProviderRoute.tsx`
Auth guard component similar to admin's ProtectedRoute that:
- Uses `onProviderAuthStateChanged` to check auth status
- Shows loading spinner while checking
- Redirects to `/provider-login` if not authenticated
- Shows provider content if authenticated
- Handles auth state changes properly

### 5. `/src/provider/pages/ProviderDashboard.tsx`
Basic provider dashboard that:
- Welcomes provider by name
- Shows their assigned quotes from Firestore
- Displays provider information
- Has a sign out button
- Uses the same dark theme as admin dashboard
- Shows "No assigned work yet" if no quotes assigned

## Files to Update

### Update `/src/App.jsx`
Add these new routes:
```jsx
import ProviderAccountCreationPage from "./provider/pages/ProviderAccountCreationPage";
import ProtectedProviderRoute from "./provider/components/ProtectedProviderRoute";
import ProviderDashboard from "./provider/pages/ProviderDashboard";

// Add inside <Routes>:
<Route path="/provider-create-account" element={<ProviderAccountCreationPage />} />
<Route path="/provider-dashboard" element={
  <ProtectedProviderRoute>
    <ProviderDashboard />
  </ProtectedProviderRoute>
} />
```

### Update `/src/provider/components/ProviderLogin.tsx`
Replace the TODO authentication with:
```typescript
import { signInProvider } from '../utils/providerAuth';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await signInProvider(email, password, stayLoggedIn);
    setTimeout(() => {
      onLoginSuccess();
    }, 100);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
    setLoading(false);
  }
};
```

Add a "Create Account" link that goes to `/provider-create-account`

### Update `/src/provider/pages/ProviderLoginPage.tsx`
Change navigation after successful login:
```typescript
const handleLoginSuccess = () => {
  navigate('/provider-dashboard');
};
```

### Update `/src/components/serviceproviders/ServiceProviderForm.tsx`
Add a note in the success message:
"Thank you for applying! Once approved, you'll receive information about creating your account."

## TypeScript Interfaces

Ensure these interfaces are defined:

```typescript
// In providerAuth.ts
export interface ProviderUser {
  uid: string;
  email: string;
  role: 'provider';
  providerId: string; // Links to serviceProviders collection
  firstName: string;
  lastName: string;
  companyName?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
```

## Firestore Structure Updates

After implementation, these documents should exist:

### `users/{userId}` (created during account creation)
```typescript
{
  uid: string;
  email: string;
  role: 'provider'; // or 'admin'
  providerId: string; // for providers only
  firstName: string;
  lastName: string;
  companyName?: string;
  status: 'active' | 'inactive';
  createdAt: string; // ISO timestamp
}
```

### `serviceProviders/{providerId}` (updated during account creation)
```typescript
{
  // ... existing fields ...
  accountCreated: boolean; // added
  accountCreatedAt?: string; // added
  userId?: string; // added - links to users collection
}
```

## Security Considerations

1. **Validation**: Always verify email is approved before account creation
2. **Duplicate Prevention**: Check if account already exists before creating
3. **Role Verification**: Verify user role during login
4. **Status Check**: Ensure provider status is 'active' during login
5. **Error Handling**: Provide user-friendly error messages, never expose system details

## Testing Requirements

After implementation, verify:
1. ✅ Unapproved email cannot create account (shows error)
2. ✅ Approved email can create account successfully
3. ✅ Duplicate account creation blocked (shows "account exists" error)
4. ✅ Email validation shows real-time feedback
5. ✅ Password strength indicator works correctly
6. ✅ Password match validation works
7. ✅ Account creation updates serviceProviders document correctly
8. ✅ Created account can login successfully
9. ✅ Login validates role and status
10. ✅ Provider can access dashboard after login
11. ✅ Provider cannot access admin routes
12. ✅ Logout works correctly
13. ✅ Protected routes redirect to login when not authenticated
14. ✅ Auth state persists across page refreshes

## Styling Guidelines

- Use the existing dark theme gradient: `linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)`
- Match the glass morphism style: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(20px)`
- Use consistent colors:
  - Primary accent: `#667eea` (purple)
  - Secondary accent: `#FFD300` (yellow)
  - Success: `#10b981` (green)
  - Error: `#ef4444` (red)
  - Warning: `#f59e0b` (amber)
- Match existing component styles (form inputs, buttons, cards)
- Include hover states and transitions
- Make responsive for mobile devices

## Firebase Imports

All files should import from the centralized firebase config:
```typescript
import {
  getFirebase,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where
} from "../../firebase/firebase";
```

## Error Messages

Use these user-friendly error messages:
- "Your application has not been approved yet. Please contact support if you believe this is an error."
- "An account with this email already exists. Please try logging in instead."
- "Password should be at least 6 characters long."
- "Invalid email or password"
- "Too many failed login attempts. Please try again later."
- "Your account has been deactivated. Please contact support."
- "Passwords do not match"
- "Email not approved. Please apply first."

## Navigation Links

Ensure these links are present:
- Provider login page → "Create Account" link to `/provider-create-account`
- Provider account creation → "Already have an account? Login" link to `/provider-login`
- Provider account creation → "Apply first" link to `/providers` (if email not approved)
- All provider pages → "Back" link to appropriate parent page
- Provider dashboard → Sign out button

## Additional Notes

1. The provider dashboard should load assigned quotes by querying: `where('assignedProviderId', '==', providerId)`
2. Use the same loading states and spinners as the admin dashboard
3. Include proper TypeScript types for all functions and components
4. Handle edge cases (network errors, Firebase errors, etc.)
5. Add console logs for debugging during development
6. Format dates consistently using the pattern from admin dashboard
7. Ensure all forms prevent submission while loading
8. Disable inputs while loading

## Success Criteria

Implementation is complete when:
1. An approved service provider can create an account at `/provider-create-account`
2. The system prevents unapproved emails from creating accounts
3. The system prevents duplicate account creation
4. Created accounts can successfully login at `/provider-login`
5. Logged-in providers can access their dashboard at `/provider-dashboard`
6. The dashboard shows their assigned quotes
7. Providers can sign out successfully
8. All protected routes redirect properly when not authenticated
9. The UI matches the existing design system
10. All TypeScript types are properly defined with no errors

## Implementation Order

Suggested order to prevent circular dependencies:
1. Create `providerAuth.ts` (no dependencies)
2. Create `ProviderAccountCreation.tsx` (depends on providerAuth)
3. Create `ProviderAccountCreationPage.tsx` (depends on ProviderAccountCreation)
4. Update `ProviderLogin.tsx` (depends on providerAuth)
5. Create `ProtectedProviderRoute.tsx` (depends on providerAuth)
6. Create `ProviderDashboard.tsx` (depends on providerAuth)
7. Update `ProviderLoginPage.tsx` (navigation update)
8. Update `App.jsx` (add all new routes)
9. Optional: Update `ServiceProviderForm.tsx` (improve success message)

Please implement all of the above following the existing code patterns and styling in my application.
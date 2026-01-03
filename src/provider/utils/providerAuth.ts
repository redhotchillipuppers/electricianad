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
  serviceAreas?: string[]; // Service areas from serviceProviders collection
}

interface ServiceProviderData {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  status: string;
  accountCreated?: boolean;
  userId?: string;
}

/**
 * Check if email exists in serviceProviders with status='approved'
 */
export const checkEmailApproved = async (email: string): Promise<ServiceProviderData | null> => {
  try {
    const { db } = getFirebase();
    const providersRef = collection(db, 'serviceProviders');
    const q = query(providersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const providerDoc = querySnapshot.docs[0];
    const providerData = providerDoc.data() as ServiceProviderData;

    // Check if status is 'approved' (case-insensitive)
    if (providerData.status?.toLowerCase() === 'approved') {
      return {
        id: providerDoc.id,
        ...providerData
      };
    }

    return null;
  } catch (error) {
    console.error('Error checking email approval:', error);
    throw new Error('Failed to verify email approval status');
  }
};

/**
 * Check if user account already exists for email
 */
export const checkProviderAccountExists = async (email: string): Promise<boolean> => {
  try {
    const { db } = getFirebase();
    const providersRef = collection(db, 'serviceProviders');
    const q = query(providersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    const providerData = querySnapshot.docs[0].data();
    return providerData.accountCreated === true;
  } catch (error) {
    console.error('Error checking if account exists:', error);
    return false;
  }
};

/**
 * Create Firebase Auth account + user document (role: 'provider')
 */
export const createProviderAccount = async (
  email: string,
  password: string
): Promise<ProviderUser> => {
  try {
    // First, verify email is approved
    const approvedProvider = await checkEmailApproved(email);
    if (!approvedProvider) {
      throw new Error('Your application has not been approved yet. Please contact support if you believe this is an error.');
    }

    // Check if account already exists
    const accountExists = await checkProviderAccountExists(email);
    if (accountExists) {
      throw new Error('An account with this email already exists. Please try logging in instead.');
    }

    // Validate password
    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters long.');
    }

    const { auth, db } = getFirebase();

    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create provider user document
    const providerUser: ProviderUser = {
      uid: user.uid,
      email: user.email || email,
      role: 'provider',
      providerId: approvedProvider.id,
      firstName: approvedProvider.firstName,
      lastName: approvedProvider.lastName,
      companyName: approvedProvider.companyName,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Store user document in users collection
    await setDoc(doc(collection(db, 'users'), user.uid), providerUser);

    // Update serviceProviders document with account creation info
    await updateDoc(doc(db, 'serviceProviders', approvedProvider.id), {
      accountCreated: true,
      userId: user.uid,
      accountCreatedAt: new Date().toISOString()
    });

    console.log('Provider account created successfully:', providerUser);
    return providerUser;
  } catch (error) {
    console.error('Provider account creation failed:', error);
    if (error instanceof Error) {
      // Handle Firebase auth errors with user-friendly messages
      if (error.message.includes('email-already-in-use')) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }
      if (error.message.includes('weak-password')) {
        throw new Error('Password should be at least 6 characters long.');
      }
      if (error.message.includes('invalid-email')) {
        throw new Error('Invalid email address.');
      }
      throw error;
    }
    throw new Error('Failed to create provider account');
  }
};

/**
 * Check if user has provider role in Firestore and is active
 */
const checkProviderRole = async (uid: string): Promise<ProviderUser | null> => {
  try {
    const { db } = getFirebase();
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (userDoc.exists()) {
      const userData = userDoc.data() as ProviderUser;

      // Verify role is provider
      if (userData.role === 'provider') {
        // Check if status is active
        if (userData.status !== 'active') {
          throw new Error('Your account has been deactivated. Please contact support.');
        }

        // Fetch service areas from serviceProviders collection
        if (userData.providerId) {
          try {
            const providerDoc = await getDoc(doc(db, 'serviceProviders', userData.providerId));
            if (providerDoc.exists()) {
              const providerData = providerDoc.data();
              userData.serviceAreas = providerData.serviceAreas || [];
            }
          } catch (error) {
            console.error('Error fetching service areas:', error);
            // Don't fail the whole auth if we can't get service areas
          }
        }

        return userData;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking provider role:', error);
    if (error instanceof Error && error.message.includes('deactivated')) {
      throw error;
    }
    return null;
  }
};

/**
 * Sign in and verify provider role and status
 */
export const signInProvider = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<ProviderUser> => {
  try {
    const { auth } = getFirebase();

    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user has provider role and is active
    const providerUser = await checkProviderRole(user.uid);

    if (!providerUser) {
      await signOut(auth);
      throw new Error('Unauthorized access - provider privileges required');
    }

    // TODO: Handle remember me functionality if needed
    // Firebase auth persistence can be configured here

    console.log('Provider signed in successfully:', providerUser);
    return providerUser;
  } catch (error) {
    console.error('Provider sign in failed:', error);
    if (error instanceof Error) {
      // Handle Firebase auth errors with user-friendly messages
      if (error.message.includes('user-not-found') || error.message.includes('wrong-password') || error.message.includes('invalid-credential')) {
        throw new Error('Invalid email or password');
      }
      if (error.message.includes('too-many-requests')) {
        throw new Error('Too many failed login attempts. Please try again later.');
      }
      if (error.message.includes('deactivated') || error.message.includes('Unauthorized')) {
        throw error;
      }
      throw new Error('Invalid email or password');
    }
    throw new Error('Failed to sign in');
  }
};

/**
 * Sign out current user
 */
export const signOutProvider = async (): Promise<void> => {
  try {
    const { auth } = getFirebase();
    await signOut(auth);
    console.log('Provider signed out successfully');
  } catch (error) {
    console.error('Sign out failed:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Listen to auth state changes for providers
 */
export const onProviderAuthStateChanged = (callback: (user: ProviderUser | null) => void) => {
  const { auth } = getFirebase();

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user has provider role and is active
      try {
        const providerUser = await checkProviderRole(user.uid);
        callback(providerUser);
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Get current authenticated provider
 */
export const getCurrentProviderUser = async (): Promise<ProviderUser | null> => {
  const { auth } = getFirebase();
  const user = auth.currentUser;

  if (!user) return null;

  // Check role and status in Firestore
  return await checkProviderRole(user.uid);
};

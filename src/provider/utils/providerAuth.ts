import {
  getFirebase,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc
} from "../../firebase/firebase";

export interface ProviderUser {
  uid: string;
  email: string;
  role: 'provider';
  businessName?: string;
  createdAt: string;
}

/**
 * Check if user has provider role in Firestore
 */
const checkUserRole = async (uid: string): Promise<ProviderUser | null> => {
  try {
    const { db } = getFirebase();
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'provider') {
        return userData as ProviderUser;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

/**
 * Sign in provider user
 */
export const signInProvider = async (email: string, password: string): Promise<ProviderUser> => {
  try {
    const { auth } = getFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user has provider role in Firestore
    const providerUser = await checkUserRole(user.uid);

    if (!providerUser) {
      await signOut(auth);
      throw new Error('Unauthorized access - provider privileges required');
    }

    return providerUser;
  } catch (error) {
    console.error('Provider sign in failed:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
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
  } catch (error) {
    console.error('Sign out failed:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Create initial provider account (use this once to set up your account)
 */
export const createProviderAccount = async (email: string, password: string, businessName?: string): Promise<ProviderUser> => {
  try {
    const { auth, db } = getFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store provider user info in Firestore
    const providerUser: ProviderUser = {
      uid: user.uid,
      email: user.email || '',
      role: 'provider',
      businessName: businessName || '',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(collection(db, 'users'), user.uid), providerUser);

    return providerUser;
  } catch (error) {
    console.error('Provider account creation failed:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create provider account');
  }
};

/**
 * Listen to auth state changes
 */
export const onProviderAuthStateChanged = (callback: (user: ProviderUser | null) => void) => {
  const { auth } = getFirebase();

  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user has provider role in Firestore
      const providerUser = await checkUserRole(user.uid);
      callback(providerUser);
    } else {
      callback(null);
    }
  });
};

/**
 * Get current authenticated user
 */
export const getCurrentProviderUser = async (): Promise<ProviderUser | null> => {
  const { auth } = getFirebase();
  const user = auth.currentUser;

  if (!user) return null;

  // Check role in Firestore
  return await checkUserRole(user.uid);
};

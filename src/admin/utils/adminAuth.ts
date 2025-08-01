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

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'provider';
  createdAt: string;
}

/**
 * Check if user has admin role in Firestore
 */
const checkUserRole = async (uid: string): Promise<AdminUser | null> => {
  try {
    const { db } = getFirebase();
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        return userData as AdminUser;
      }
    }
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

/**
 * Sign in admin user
 */
export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
  try {
    const { auth } = getFirebase();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user has admin role in Firestore
    const adminUser = await checkUserRole(user.uid);
    
    if (!adminUser) {
      await signOut(auth);
      throw new Error('Unauthorized access - admin privileges required');
    }

    return adminUser;
  } catch (error) {
    console.error('Admin sign in failed:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to sign in');
  }
};

/**
 * Sign out current user
 */
export const signOutAdmin = async (): Promise<void> => {
  try {
    const { auth } = getFirebase();
    await signOut(auth);
  } catch (error) {
    console.error('Sign out failed:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Create initial admin account (use this once to set up your account)
 */
export const createAdminAccount = async (email: string, password: string): Promise<AdminUser> => {
  try {
    const { auth, db } = getFirebase();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store admin user info in Firestore
    const adminUser: AdminUser = {
      uid: user.uid,
      email: user.email || '',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(collection(db, 'users'), user.uid), adminUser);

    return adminUser;
  } catch (error) {
    console.error('Admin account creation failed:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to create admin account');
  }
};

/**
 * Listen to auth state changes
 */
export const onAdminAuthStateChanged = (callback: (user: AdminUser | null) => void) => {
  const { auth } = getFirebase();
  
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user has admin role in Firestore
      const adminUser = await checkUserRole(user.uid);
      callback(adminUser);
    } else {
      callback(null);
    }
  });
};

/**
 * Get current authenticated user
 */
export const getCurrentAdminUser = async (): Promise<AdminUser | null> => {
  const { auth } = getFirebase();
  const user = auth.currentUser;
  
  if (!user) return null;

  // Check role in Firestore
  return await checkUserRole(user.uid);
};
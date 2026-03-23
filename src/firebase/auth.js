// src/firebase/auth.js
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './config';
import toast from 'react-hot-toast';

// Sign up with email and password
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    toast.success('Account created successfully!');
    return { user: userCredential.user, error: null };
  } catch (error) {
    let errorMessage = 'Failed to create account';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use. Please sign in instead.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    toast.error(errorMessage);
    return { user: null, error: errorMessage };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    toast.success('Welcome back!');
    return { user: userCredential.user, error: null };
  } catch (error) {
    let errorMessage = 'Failed to sign in';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email. Please sign up first.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    toast.error(errorMessage);
    return { user: null, error: errorMessage };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    toast.success(`Welcome ${result.user.displayName || 'User'}!`);
    return { user: result.user, error: null };
  } catch (error) {
    let errorMessage = 'Failed to sign in with Google';
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    }
    toast.error(errorMessage);
    return { user: null, error: errorMessage };
  }
};

// Sign in with GitHub
export const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    toast.success(`Welcome ${result.user.displayName || 'User'}!`);
    return { user: result.user, error: null };
  } catch (error) {
    let errorMessage = 'Failed to sign in with GitHub';
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    }
    toast.error(errorMessage);
    return { user: null, error: errorMessage };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent! Check your inbox.');
    return { success: true, error: null };
  } catch (error) {
    let errorMessage = 'Failed to send reset email';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    }
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    toast.success('Logged out successfully');
    return { success: true, error: null };
  } catch (error) {
    toast.error('Failed to log out');
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
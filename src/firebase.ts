import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { StudentUser, ExamAttemptResult } from './types';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with specific database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot as mandated
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline or still initializing.');
    }
    return false;
  }
}

// Run connection test silently in background
testFirestoreConnection();

/**
 * Sign in with Google Auth Provider
 */
export async function signInWithGoogle(): Promise<{ user: User; isNew?: boolean }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

/**
 * Sign out current Firebase user
 */
export async function logOutFirebaseUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Firebase sign-out error:', err);
  }
}

/**
 * Save / Update student profile in Firestore
 */
export async function syncStudentProfileToFirestore(student: StudentUser): Promise<void> {
  if (!student || !student.id) return;
  try {
    const userRef = doc(db, 'users', student.id);
    await setDoc(
      userRef,
      {
        uid: student.id,
        name: student.name,
        email: student.email,
        role: student.role || 'student',
        targetExam: student.targetExam,
        examDate: student.examDate,
        targetGrade: student.targetGrade,
        targetSecondsPerMark: student.targetSecondsPerMark,
        enrolledSubjects: student.enrolledSubjects,
        avatarInitials: student.avatarInitials,
        streakDays: student.streakDays,
        completedRemediations: student.completedRemediations || [],
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not sync student profile to Firestore:', error);
  }
}

/**
 * Load student profile from Firestore
 */
export async function fetchStudentProfileFromFirestore(uid: string): Promise<Partial<StudentUser> | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as Partial<StudentUser>;
    }
    return null;
  } catch (error) {
    console.warn('Failed to fetch user from Firestore:', error);
    return null;
  }
}

/**
 * Save an exam attempt to Firestore under users/{userId}/attempts/{attemptId}
 */
export async function recordExamAttemptToFirestore(
  studentId: string,
  attempt: ExamAttemptResult
): Promise<void> {
  if (!studentId || !attempt || !attempt.id) return;
  try {
    const attemptRef = doc(db, 'users', studentId, 'attempts', attempt.id);
    await setDoc(attemptRef, {
      ...attempt,
      studentId,
      syncedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Could not persist exam attempt to Firestore:', error);
  }
}

/**
 * Load past exam attempts for a student from Firestore
 */
export async function fetchStudentAttemptsFromFirestore(
  studentId: string
): Promise<ExamAttemptResult[]> {
  if (!studentId) return [];
  try {
    const colRef = collection(db, 'users', studentId, 'attempts');
    const querySnapshot = await getDocs(colRef);
    const attempts: ExamAttemptResult[] = [];
    querySnapshot.forEach((docSnap) => {
      attempts.push(docSnap.data() as ExamAttemptResult);
    });
    // Sort newest first
    attempts.sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
    return attempts;
  } catch (error) {
    console.warn('Could not fetch attempts from Firestore:', error);
    return [];
  }
}

export { onAuthStateChanged };

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Service, BoutiqueProduct, StaffMember, Booking, StudioSettings } from '../types';

const SETTINGS_COLLECTION = 'settings';
const SERVICES_COLLECTION = 'services';
const PRODUCTS_COLLECTION = 'products';
const STAFF_COLLECTION = 'staff';
const BOOKINGS_COLLECTION = 'bookings';
const USERS_COLLECTION = 'users';

// Settings
export async function fetchFirestoreSettings(): Promise<StudioSettings | null> {
  const path = `${SETTINGS_COLLECTION}/main`;
  try {
    const snap = await getDoc(doc(db, SETTINGS_COLLECTION, 'main'));
    if (snap.exists()) {
      return snap.data() as StudioSettings;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch settings from Firestore, fallback to local:', error);
    return null;
  }
}

export async function saveFirestoreSettings(settings: StudioSettings): Promise<void> {
  const path = `${SETTINGS_COLLECTION}/main`;
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, 'main'), {
      ...settings,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Services Real-time listener
export function subscribeFirestoreServices(
  onUpdate: (services: Service[]) => void,
  onError?: (err: unknown) => void
) {
  const path = SERVICES_COLLECTION;
  return onSnapshot(
    collection(db, SERVICES_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore services error:', error);
      onError?.(error);
    }
  );
}

export async function saveFirestoreService(service: Service): Promise<void> {
  const path = `${SERVICES_COLLECTION}/${service.id}`;
  try {
    await setDoc(doc(db, SERVICES_COLLECTION, service.id), service);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFirestoreService(serviceId: string): Promise<void> {
  const path = `${SERVICES_COLLECTION}/${serviceId}`;
  try {
    await deleteDoc(doc(db, SERVICES_COLLECTION, serviceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Products Real-time listener
export function subscribeFirestoreProducts(
  onUpdate: (products: BoutiqueProduct[]) => void,
  onError?: (err: unknown) => void
) {
  const path = PRODUCTS_COLLECTION;
  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BoutiqueProduct));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore products error:', error);
      onError?.(error);
    }
  );
}

export async function saveFirestoreProduct(product: BoutiqueProduct): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFirestoreProduct(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Staff Real-time listener
export function subscribeFirestoreStaff(
  onUpdate: (staff: StaffMember[]) => void,
  onError?: (err: unknown) => void
) {
  const path = STAFF_COLLECTION;
  return onSnapshot(
    collection(db, STAFF_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StaffMember));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore staff error:', error);
      onError?.(error);
    }
  );
}

export async function saveFirestoreStaffMember(member: StaffMember): Promise<void> {
  const path = `${STAFF_COLLECTION}/${member.id}`;
  try {
    await setDoc(doc(db, STAFF_COLLECTION, member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Bookings Real-time listener
export function subscribeFirestoreBookings(
  onUpdate: (bookings: Booking[]) => void,
  onError?: (err: unknown) => void
) {
  const path = BOOKINGS_COLLECTION;
  return onSnapshot(
    collection(db, BOOKINGS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Booking));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore bookings error:', error);
      onError?.(error);
    }
  );
}

export async function saveFirestoreBooking(booking: Booking): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${booking.id}`;
  try {
    await setDoc(doc(db, BOOKINGS_COLLECTION, booking.id), booking);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateFirestoreBookingStatus(
  bookingId: string,
  newStatus: Booking['status']
): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  try {
    const ref = doc(db, BOOKINGS_COLLECTION, bookingId);
    await setDoc(ref, { status: newStatus }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteFirestoreBooking(bookingId: string): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  try {
    await deleteDoc(doc(db, BOOKINGS_COLLECTION, bookingId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// User Profile
export async function saveUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}) {
  const path = `${USERS_COLLECTION}/${user.uid}`;
  try {
    await setDoc(
      doc(db, USERS_COLLECTION, user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Could not save user profile:', error);
  }
}

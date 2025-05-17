import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore"
import { db } from "./firebase"

// User profile operations
export const createUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId)
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() }
  }

  return null
}

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, "users", userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Transaction operations
export const createTransaction = async (userId: string, transactionData: any) => {
  const transactionsRef = collection(db, "users", userId, "transactions")
  const newTransactionRef = doc(transactionsRef)

  await setDoc(newTransactionRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return newTransactionRef.id
}

export const getTransactions = async (userId: string, constraints: QueryConstraint[] = []) => {
  const transactionsRef = collection(db, "users", userId, "transactions")
  const q = query(transactionsRef, ...constraints)
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const getRecentTransactions = async (userId: string, limit = 10) => {
  // , limit(limit)
  return getTransactions(userId, [orderBy("createdAt", "desc")])
}

// Account operations
export const createAccount = async (userId: string, accountData: any) => {
  const accountsRef = collection(db, "users", userId, "accounts")
  const newAccountRef = doc(accountsRef)

  await setDoc(newAccountRef, {
    ...accountData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return newAccountRef.id
}

export const getAccounts = async (userId: string) => {
  const accountsRef = collection(db, "users", userId, "accounts")
  const querySnapshot = await getDocs(accountsRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export const updateAccount = async (userId: string, accountId: string, data: any) => {
  const accountRef = doc(db, "users", userId, "accounts", accountId)
  await updateDoc(accountRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

// Budget operations
export const createBudget = async (userId: string, budgetData: any) => {
  const budgetsRef = collection(db, "users", userId, "budgets")
  const newBudgetRef = doc(budgetsRef)

  await setDoc(newBudgetRef, {
    ...budgetData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return newBudgetRef.id
}

export const getBudgets = async (userId: string) => {
  const budgetsRef = collection(db, "users", userId, "budgets")
  const querySnapshot = await getDocs(budgetsRef)

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

// Settings operations
export const saveUserSettings = async (userId: string, settings: any) => {
  const settingsRef = doc(db, "users", userId, "settings", "preferences")
  await setDoc(
    settingsRef,
    {
      ...settings,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const getUserSettings = async (userId: string) => {
  const settingsRef = doc(db, "users", userId, "settings", "preferences")
  const settingsSnap = await getDoc(settingsRef)

  if (settingsSnap.exists()) {
    return settingsSnap.data()
  }

  return null
}

// Helper to convert Firestore timestamps to JS dates
export const convertTimestamps = (data: DocumentData) => {
  const result: any = { ...data }

  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate()
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = convertTimestamps(result[key])
    }
  })

  return result
}

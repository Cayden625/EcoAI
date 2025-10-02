import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore'
import { auth, googleProvider, db } from '../services/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return
    
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user
      const createdAt = new Date()
      
      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.name || 'Eco Warrior',
          email,
          photoURL: photoURL || null,
          createdAt,
          points: 0,
          level: 1,
          badges: ['newcomer'],
          totalUploads: 0,
          totalReports: 0,
          streak: 0,
          lastLogin: createdAt,
          ...additionalData
        })
      } catch (error) {
        console.error('Error creating user profile:', error)
      }
    } else {
      // Update last login
      try {
        await updateDoc(userRef, {
          lastLogin: new Date()
        })
      } catch (error) {
        console.error('Error updating last login:', error)
      }
    }
    
    return userRef
  }

  // Update user points and level
  const updateUserPoints = async (pointsToAdd = 5) => {
    if (!user) return
    
    const userRef = doc(db, 'users', user.uid)
    try {
      await updateDoc(userRef, {
        points: increment(pointsToAdd)
      })
      
      // Check for level up logic could be added here
      toast.success(`+${pointsToAdd} eco points earned! 🌱`)
    } catch (error) {
      console.error('Error updating user points:', error)
    }
  }

  // Sign up with email and password
  const signUp = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name
      await updateProfile(result.user, {
        displayName: name
      })
      
      // Create user profile
      await createUserProfile(result.user, { name })
      
      toast.success('Welcome to EcoAI Pro! 🌍')
      return result
    } catch (error) {
      toast.error(error.message)
      throw error
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome back, Eco Warrior! 🌱')
      return result
    } catch (error) {
      toast.error('Invalid credentials')
      throw error
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await createUserProfile(result.user)
      toast.success('Successfully signed in with Google! 🌍')
      return result
    } catch (error) {
      toast.error('Google sign in failed')
      throw error
    }
  }

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('See you later, Eco Warrior! 👋')
    } catch (error) {
      toast.error('Sign out failed')
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserProfile(user)
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserPoints,
    createUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
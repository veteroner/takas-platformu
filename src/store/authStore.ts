import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  phone?: string
  joinDate: string
  itemsShared: number
  itemsReceived: number
  rating: number
  preferences: {
    notifications: boolean
    privacy: 'public' | 'private'
    language: 'tr' | 'en'
    theme: 'light' | 'dark' | 'system'
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
  updatePreferences: (preferences: Partial<User['preferences']>) => void
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Mock kullanıcı verisi
const mockUser: User = {
  id: '1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Sürdürülebilir yaşam tutkunu. Eşyalarımı paylaşmayı seviyorum!',
  location: 'İstanbul, Türkiye',
  phone: '+90 555 123 4567',
  joinDate: '2024-01-15',
  itemsShared: 25,
  itemsReceived: 18,
  rating: 4.8,
  preferences: {
    notifications: true,
    privacy: 'public',
    language: 'tr',
    theme: 'system'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true })
        
        // Mock login - gerçek uygulamada API çağrısı yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (email === 'ahmet@example.com' && password === '123456') {
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      register: async (userData: RegisterData): Promise<boolean> => {
        set({ isLoading: true })
        
        // Mock register - gerçek uygulamada API çağrısı yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          joinDate: new Date().toISOString().split('T')[0],
          itemsShared: 0,
          itemsReceived: 0,
          rating: 5.0,
          preferences: {
            notifications: true,
            privacy: 'public',
            language: 'tr',
            theme: 'system'
          }
        }
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        })
        return true
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateProfile: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          })
        }
      },

      updatePreferences: (preferences: Partial<User['preferences']>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ 
            user: { 
              ...currentUser, 
              preferences: { ...currentUser.preferences, ...preferences } 
            } 
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

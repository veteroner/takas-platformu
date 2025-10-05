import { Item, CategoryType, ItemCondition } from '@/types'

export const mockUsers = [
  {
    id: '1',
    email: 'ayse@example.com',
    name: 'Ayşe Yılmaz',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c100?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'İstanbul',
      country: 'Türkiye',
      coordinates: { lat: 41.0082, lng: 28.9784 }
    },
    rating: 4.8,
    totalTrades: 23,
    joinedAt: new Date('2023-01-15'),
    preferences: {
      categories: [CategoryType.CLOTHING_WOMEN, CategoryType.ACCESSORIES],
      maxDistance: 20,
      ageRange: { min: 20, max: 40 }
    }
  },
  {
    id: '2',
    email: 'mehmet@example.com',
    name: 'Mehmet Kaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'Ankara',
      country: 'Türkiye',
      coordinates: { lat: 39.9334, lng: 32.8597 }
    },
    rating: 4.6,
    totalTrades: 15,
    joinedAt: new Date('2023-03-20'),
    preferences: {
      categories: [CategoryType.ELECTRONICS, CategoryType.TOYS_KIDS],
      maxDistance: 15,
      ageRange: { min: 25, max: 45 }
    }
  },
  {
    id: '3',
    email: 'zeynep@example.com',
    name: 'Zeynep Öz',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    location: {
      city: 'İzmir',
      country: 'Türkiye',
      coordinates: { lat: 38.4192, lng: 27.1287 }
    },
    rating: 4.9,
    totalTrades: 31,
    joinedAt: new Date('2022-11-10'),
    preferences: {
      categories: [CategoryType.CLOTHING_KIDS, CategoryType.TOYS_BABY],
      maxDistance: 25,
      ageRange: { min: 18, max: 35 }
    }
  }
]

// LocalStorage key
const UPLOADED_ITEMS_KEY = 'takas_uploaded_items'

// Get uploaded items from localStorage
export const getUploadedItems = (): Item[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(UPLOADED_ITEMS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading uploaded items:', error)
    return []
  }
}

// Save uploaded item to localStorage
export const saveUploadedItem = (item: Partial<Item>): Item => {
  const uploadedItems = getUploadedItems()
  
  const newItem: Item = {
    id: `uploaded-${Date.now()}`,
    title: item.title || '',
    description: item.description || '',
    category: item.category as CategoryType,
    condition: item.condition as ItemCondition,
    images: item.images || [],
    ownerId: 'current-user',
    owner: {
      id: 'current-user',
      name: 'Ben',
      email: 'user@takas.com',
      avatar: '/icons/app-icon.svg',
      location: {
        city: 'İstanbul',
        country: 'Türkiye',
        coordinates: { lat: 41.0082, lng: 28.9784 }
      },
      rating: 5.0,
      totalTrades: 0,
      joinedAt: new Date(),
      preferences: {
        categories: [],
        maxDistance: 50,
        ageRange: { min: 18, max: 100 }
      }
    },
    estimatedValue: item.estimatedValue || 0,
    createdAt: new Date(),
    isActive: true,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: [],
    size: item.size,
    brand: item.brand,
    color: item.color
  }
  
  uploadedItems.unshift(newItem) // En başa ekle
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(UPLOADED_ITEMS_KEY, JSON.stringify(uploadedItems))
  }
  
  return newItem
}

// Get all items (uploaded + mock)
export const getAllItems = (): Item[] => {
  const uploadedItems = getUploadedItems()
  return [...uploadedItems, ...mockItems]
}

export const mockItems: Item[] = [
  {
    id: '1',
    title: 'Vintage Denim Ceket',
    description: 'Çok şık vintage denim ceket. Oversize kesim, hafif yıpranmış görünüm. Çok rahat ve stil sahibi.',
    category: CategoryType.CLOTHING_WOMEN,
    condition: ItemCondition.GOOD,
    size: 'M',
    brand: 'Levi\'s',
    color: ['Mavi', 'İndigo'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop'
    ],
    ownerId: '1',
    owner: mockUsers[0],
    estimatedValue: 250,
    createdAt: new Date('2024-01-15'),
    isActive: true,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: ['vintage', 'denim', 'oversize', 'retro']
  },
  {
    id: '2',
    title: 'LEGO Mimari Seri - Eyfel Kulesi',
    description: 'Hiç açılmamış LEGO Mimari serisi Eyfel Kulesi seti. Orijinal kutusunda, tüm parçalar mevcut.',
    category: CategoryType.TOYS_KIDS,
    condition: ItemCondition.NEW,
    brand: 'LEGO',
    color: ['Gri', 'Siyah'],
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=600&fit=crop'
    ],
    ownerId: '2',
    owner: mockUsers[1],
    estimatedValue: 180,
    createdAt: new Date('2024-01-20'),
    isActive: true,
    location: {
      city: 'Ankara',
      country: 'Türkiye'
    },
    tags: ['lego', 'mimari', 'eyfel', 'yeni', 'koleksiyon']
  },
  {
    id: '3',
    title: 'Bohem Çiçekli Elbise',
    description: 'Yazlık bohem tarzı çiçek desenli midi elbise. Çok rahat ve şık. Düğün, davet için ideal.',
    category: CategoryType.CLOTHING_WOMEN,
    condition: ItemCondition.LIKE_NEW,
    size: 'S',
    brand: 'Zara',
    color: ['Pembe', 'Yeşil', 'Beyaz'],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop'
    ],
    ownerId: '3',
    owner: mockUsers[2],
    estimatedValue: 120,
    createdAt: new Date('2024-01-25'),
    isActive: true,
    location: {
      city: 'İzmir',
      country: 'Türkiye'
    },
    tags: ['bohem', 'çiçekli', 'yazlık', 'midi', 'şık']
  },
  {
    id: '4',
    title: 'Antik Ahşap Oyuncak Tren',
    description: 'El yapımı ahşap oyuncak tren seti. Çok kaliteli işçilik. Nostaljik ve eğitici.',
    category: CategoryType.TOYS_KIDS,
    condition: ItemCondition.GOOD,
    brand: 'Handmade',
    color: ['Kahverengi', 'Kırmızı', 'Sarı'],
    images: [
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=600&fit=crop'
    ],
    ownerId: '1',
    owner: mockUsers[0],
    estimatedValue: 80,
    createdAt: new Date('2024-02-01'),
    isActive: true,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: ['ahşap', 'el-yapımı', 'nostaljik', 'eğitici', 'tren']
  },
  {
    id: '5',
    title: 'Spor Ayakkabı Nike Air Max',
    description: 'Çok az kullanılmış Nike Air Max spor ayakkabı. Temiz ve konforlu. Koşu için ideal.',
    category: CategoryType.SHOES,
    condition: ItemCondition.LIKE_NEW,
    size: '42',
    brand: 'Nike',
    color: ['Beyaz', 'Siyah'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop'
    ],
    ownerId: '2',
    owner: mockUsers[1],
    estimatedValue: 300,
    createdAt: new Date('2024-02-05'),
    isActive: true,
    location: {
      city: 'Ankara',
      country: 'Türkiye'
    },
    tags: ['nike', 'spor', 'air-max', 'koşu', 'konforlu']
  },
  {
    id: '6',
    title: 'Bebek Oyuncak Seti',
    description: 'Renkli ve güvenli bebek oyuncak seti. BPA içermez. 6 ay ve üzeri bebekler için.',
    category: CategoryType.TOYS_BABY,
    condition: ItemCondition.GOOD,
    brand: 'Fisher Price',
    color: ['Kırmızı', 'Sarı', 'Mavi', 'Yeşil'],
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=600&fit=crop'
    ],
    ownerId: '3',
    owner: mockUsers[2],
    estimatedValue: 60,
    createdAt: new Date('2024-02-10'),
    isActive: true,
    location: {
      city: 'İzmir',
      country: 'Türkiye'
    },
    tags: ['bebek', 'güvenli', 'renkli', 'fisher-price', 'eğitici']
  },
  {
    id: '7',
    title: 'Klasik Kışlık Palto',
    description: 'Siyah klasik kışlık palto. Yün karışımlı kumaş. Çok şık ve sıcak tutuyor.',
    category: CategoryType.CLOTHING_WOMEN,
    condition: ItemCondition.GOOD,
    size: 'L',
    brand: 'Mango',
    color: ['Siyah'],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    ],
    ownerId: '1',
    owner: mockUsers[0],
    estimatedValue: 200,
    createdAt: new Date('2024-02-15'),
    isActive: true,
    location: {
      city: 'İstanbul',
      country: 'Türkiye'
    },
    tags: ['palto', 'kışlık', 'klasik', 'yün', 'şık']
  },
  {
    id: '8',
    title: 'Puzzle 1000 Parça - Van Gogh',
    description: 'Van Gogh\'un ünlü Yıldızlı Gece tablosunun 1000 parçalık puzzle\'ı. Hiç eksik yok.',
    category: CategoryType.TOYS_KIDS,
    condition: ItemCondition.LIKE_NEW,
    brand: 'Ravensburger',
    color: ['Mavi', 'Sarı', 'Siyah'],
    images: [
      'https://images.unsplash.com/photo-1559675253-e4df8ab48d09?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559675253-e4df8ab48d09?w=400&h=600&fit=crop'
    ],
    ownerId: '2',
    owner: mockUsers[1],
    estimatedValue: 45,
    createdAt: new Date('2024-02-20'),
    isActive: true,
    location: {
      city: 'Ankara',
      country: 'Türkiye'
    },
    tags: ['puzzle', 'van-gogh', 'sanat', '1000-parça', 'eğitici']
  }
]

// Mock API functions
export const fetchItems = async (
  page: number = 1, 
  limit: number = 10
): Promise<{ items: Item[], hasMore: boolean }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const allItems = getAllItems() // Uploaded + mock items
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const items = allItems.slice(startIndex, endIndex)
  
  return {
    items,
    hasMore: endIndex < allItems.length
  }
}

export const searchItems = async (
  query: string,
  filters?: {
    category?: CategoryType
    condition?: ItemCondition
    minPrice?: number
    maxPrice?: number
    location?: string
  }
): Promise<Item[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let filteredItems = getAllItems() // Use all items including uploaded
  
  // Text search
  if (query) {
    filteredItems = filteredItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }
  
  // Apply filters
  if (filters?.category) {
    filteredItems = filteredItems.filter(item => item.category === filters.category)
  }
  
  if (filters?.condition) {
    filteredItems = filteredItems.filter(item => item.condition === filters.condition)
  }
  
  if (filters?.minPrice) {
    filteredItems = filteredItems.filter(item => item.estimatedValue >= filters.minPrice!)
  }
  
  if (filters?.maxPrice) {
    filteredItems = filteredItems.filter(item => item.estimatedValue <= filters.maxPrice!)
  }
  
  if (filters?.location) {
    filteredItems = filteredItems.filter(item => 
      item.location.city.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }
  
  return filteredItems
}

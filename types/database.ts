export type UserRole = 'customer' | 'admin' | 'support'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string | null
  image_url: string | null
}

export interface Product {
  id: string
  title: string
  slug: string | null
  description: string | null
  price: number
  compare_at_price: number | null
  stock: number
  images: string[]
  featured: boolean
  category_id: string | null
  created_at: string
  categories?: Category
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  products?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  created_at: string
  shipments?: Shipment[]
  payments?: Payment[]
}

export interface Address {
  id: string
  user_id: string
  name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
}

export interface Coupon {
  code: string
  type: 'flat' | 'percent'
  value: number
  min_order: number | null
  expires_at: string | null
}

export interface Payment {
  id: string
  order_id: string
  provider: string
  provider_order_id: string | null
  provider_payment_id: string | null
  amount: number
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

export interface Shipment {
  id: string
  order_id: string
  tracking_number: string | null
  carrier: string | null
  status: string
  estimated_delivery: string | null
  created_at: string
}

export interface Return {
  id: string
  order_id: string
  reason: string
  status: 'requested' | 'approved' | 'rejected' | 'completed'
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  profiles?: Profile
}

export interface AnalyticsEvent {
  id: string
  user_id: string | null
  event: string
  payload: Record<string, unknown>
  created_at: string
}

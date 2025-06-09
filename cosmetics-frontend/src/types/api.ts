export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  roles: string[];
  active: boolean;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  active: boolean;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  active?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string;
}

export interface Cart {
  id: number;
  userId: number;
  totalAmount: number;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  trackingNumber: string | null;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
  trackingNumber?: string;
}

export interface SalesAnalytics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
  }>;
  salesByCategory: Array<{
    categoryId: number;
    categoryName: string;
    totalSales: number;
  }>;
}

export interface ApiError {
  message: string;
  status: number;
}
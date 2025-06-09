import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
  Category,
  Product,
  ProductRequest,
  PaginatedResponse,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  SalesAnalytics,
  ApiError
} from '../types/api';

const BASE_URL = 'http://localhost:8080';

class ApiService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.axios.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.axios.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  }

  // Category APIs
  async getCategories(): Promise<Category[]> {
    const response = await this.axios.get<Category[]>('/api/categories');
    return response.data;
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await this.axios.get<Category>(`/api/categories/${id}`);
    return response.data;
  }

  async createCategory(category: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    const response = await this.axios.post<Category>('/api/categories', category);
    return response.data;
  }

  async updateCategory(id: number, category: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    const response = await this.axios.put<Category>(`/api/categories/${id}`, category);
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.axios.delete(`/api/categories/${id}`);
  }

  // Product APIs
  async getProducts(page = 0, size = 10, sort = 'id,asc'): Promise<PaginatedResponse<Product>> {
    const response = await this.axios.get<PaginatedResponse<Product>>('/api/products', {
      params: { page, size, sort }
    });
    return response.data;
  }

  async getProductById(id: number): Promise<Product> {
    const response = await this.axios.get<Product>(`/api/products/${id}`);
    return response.data;
  }

  async getProductsByCategory(categoryId: number, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await this.axios.get<PaginatedResponse<Product>>(`/api/products/category/${categoryId}`, {
      params: { page, size }
    });
    return response.data;
  }

  async searchProducts(keyword: string, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await this.axios.get<PaginatedResponse<Product>>('/api/products/search', {
      params: { keyword, page, size }
    });
    return response.data;
  }

  async createProduct(product: ProductRequest): Promise<Product> {
    const response = await this.axios.post<Product>('/api/products', product);
    return response.data;
  }

  async updateProduct(id: number, product: ProductRequest): Promise<Product> {
    const response = await this.axios.put<Product>(`/api/products/${id}`, product);
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.axios.delete(`/api/products/${id}`);
  }

  // User Management APIs
  async getUsers(page = 0, size = 10): Promise<PaginatedResponse<User>> {
    const response = await this.axios.get<PaginatedResponse<User>>('/api/users', {
      params: { page, size }
    });
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.axios.get<User>(`/api/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await this.axios.put<User>(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.axios.delete(`/api/users/${id}`);
  }

  // Cart APIs
  async getCart(): Promise<Cart> {
    const response = await this.axios.get<Cart>('/api/cart');
    return response.data;
  }

  async addToCart(item: AddToCartRequest): Promise<Cart> {
    const response = await this.axios.post<Cart>('/api/cart/items', item);
    return response.data;
  }

  async updateCartItem(itemId: number, update: UpdateCartItemRequest): Promise<Cart> {
    const response = await this.axios.put<Cart>(`/api/cart/items/${itemId}`, update);
    return response.data;
  }

  async removeFromCart(itemId: number): Promise<Cart> {
    const response = await this.axios.delete<Cart>(`/api/cart/items/${itemId}`);
    return response.data;
  }

  async clearCart(): Promise<Cart> {
    const response = await this.axios.delete<Cart>('/api/cart/clear');
    return response.data;
  }

  // Order APIs
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await this.axios.post<Order>('/api/orders', orderData);
    return response.data;
  }

  async getOrders(page = 0, size = 10): Promise<PaginatedResponse<Order>> {
    const response = await this.axios.get<PaginatedResponse<Order>>('/api/orders', {
      params: { page, size }
    });
    return response.data;
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await this.axios.get<Order>(`/api/orders/${id}`);
    return response.data;
  }

  // Admin Order APIs
  async getAllOrders(page = 0, size = 10, status?: string): Promise<PaginatedResponse<Order>> {
    const params: any = { page, size };
    if (status) params.status = status;
    
    const response = await this.axios.get<PaginatedResponse<Order>>('/api/admin/orders', { params });
    return response.data;
  }

  async updateOrderStatus(id: number, statusUpdate: UpdateOrderStatusRequest): Promise<Order> {
    const response = await this.axios.put<Order>(`/api/admin/orders/${id}/status`, statusUpdate);
    return response.data;
  }

  // Analytics APIs
  async getSalesAnalytics(startDate?: string, endDate?: string): Promise<SalesAnalytics> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await this.axios.get<SalesAnalytics>('/api/admin/analytics/sales', { params });
    return response.data;
  }
}

export const apiService = new ApiService();
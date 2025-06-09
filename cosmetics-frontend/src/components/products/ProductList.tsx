import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper
} from '@mui/material';
import { Product, Category, PaginatedResponse } from '../../types/api';
import { apiService } from '../../services/api';
import { ProductCard } from './ProductCard';
import { useSearchParams } from 'react-router-dom';

interface ProductListProps {
  categoryId?: number;
  searchQuery?: string;
}

export function ProductList({ categoryId, searchQuery }: ProductListProps) {
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('id,asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery, page, sortBy]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      let response: PaginatedResponse<Product>;

      if (searchQuery) {
        response = await apiService.searchProducts(searchQuery, page, pageSize);
      } else if (categoryId) {
        response = await apiService.getProductsByCategory(categoryId, page, pageSize);
      } else {
        response = await apiService.getProducts(page, pageSize, sortBy);
      }

      setProducts(response);
    } catch (err: any) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setPage(0);
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (categoryId) {
      const category = categories.find(c => c.id === categoryId);
      return category ? category.name : 'Products';
    }
    return 'All Products';
  };

  const getPageSubtitle = () => {
    if (!products) return '';
    return `${products.totalElements} products found`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: '#e91e63', fontWeight: 'bold' }}>
          {getPageTitle()}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {getPageSubtitle()}
        </Typography>
      </Box>

      {/* Category Filters (only show on all products page) */}
      {!categoryId && !searchQuery && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Shop by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={`${category.name} (${category.productCount})`}
                onClick={() => window.location.href = `/category/${category.id}`}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e91e63',
                    color: 'white'
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Sort Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="id,asc">Default</MenuItem>
            <MenuItem value="name,asc">Name (A-Z)</MenuItem>
            <MenuItem value="name,desc">Name (Z-A)</MenuItem>
            <MenuItem value="price,asc">Price (Low to High)</MenuItem>
            <MenuItem value="price,desc">Price (High to Low)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
      {products && products.content.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {products.content.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id} component="div">
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {products.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={products.totalPages}
                page={page + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#e91e63',
                  }
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new products'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
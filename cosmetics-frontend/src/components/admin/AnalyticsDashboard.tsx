import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  ShoppingCart,
  Inventory,
  Category,
  Star,
  Refresh
} from '@mui/icons-material';
import { SalesAnalytics } from '../../types/api';

interface AnalyticsDashboardProps {
  analytics: SalesAnalytics | null;
  onRefresh: () => Promise<void>;
  detailed?: boolean;
}

export function AnalyticsDashboard({ analytics, onRefresh, detailed = false }: AnalyticsDashboardProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  if (!analytics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  const maxProductRevenue = Math.max(...analytics.topSellingProducts.map(p => p.totalRevenue));
  const maxCategorySales = Math.max(...analytics.salesByCategory.map(c => c.totalSales));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {detailed ? 'Detailed Analytics' : 'Sales Overview'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={refreshing ? <CircularProgress size={16} /> : <Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Key Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total Sales
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${analytics.totalSales.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total Orders
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {analytics.totalOrders.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Avg Order Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${analytics.averageOrderValue.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Top Products
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {analytics.topSellingProducts.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: detailed ? '1fr' : 'repeat(auto-fit, minmax(500px, 1fr))', gap: 3 }}>
        {/* Top Selling Products */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Inventory sx={{ mr: 1, color: '#e91e63' }} />
            Top Selling Products
          </Typography>
          
          {analytics.topSellingProducts.length === 0 ? (
            <Alert severity="info">No sales data available</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity Sold</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Revenue</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topSellingProducts.slice(0, detailed ? 10 : 5).map((product, index) => (
                    <TableRow key={product.productId} hover>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index === 0 ? 'error' : index === 1 ? 'warning' : index === 2 ? 'success' : 'default'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {product.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {product.productId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${product.totalQuantitySold} units`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
                          ${product.totalRevenue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '150px' }}>
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={(product.totalRevenue / maxProductRevenue) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#e91e63'
                              }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {((product.totalRevenue / maxProductRevenue) * 100).toFixed(1)}% of top
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Sales by Category */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            <Category sx={{ mr: 1, color: '#e91e63' }} />
            Sales by Category
          </Typography>
          
          {analytics.salesByCategory.length === 0 ? (
            <Alert severity="info">No category sales data available</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Sales</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Market Share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.salesByCategory.map((category, index) => (
                    <TableRow key={category.categoryId} hover>
                      <TableCell>
                        <Chip
                          label={`#${index + 1}`}
                          size="small"
                          color={index === 0 ? 'error' : index === 1 ? 'warning' : 'default'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {category.categoryName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {category.categoryId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
                          ${category.totalSales.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '150px' }}>
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={(category.totalSales / maxCategorySales) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#f0f0f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: index === 0 ? '#e91e63' : index === 1 ? '#2196f3' : '#4caf50'
                              }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {((category.totalSales / analytics.totalSales) * 100).toFixed(1)}% of total
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {detailed && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 1 }}>
          {/* Additional Analytics Cards */}
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Best Performing Product
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {analytics.topSellingProducts[0]?.productName || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${analytics.topSellingProducts[0]?.totalRevenue.toFixed(2) || '0.00'} revenue
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Top Category
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {analytics.salesByCategory[0]?.categoryName || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${analytics.salesByCategory[0]?.totalSales.toFixed(2) || '0.00'} sales
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Revenue per Order
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                ${analytics.averageOrderValue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average order value
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Product Categories
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {analytics.salesByCategory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active categories
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}
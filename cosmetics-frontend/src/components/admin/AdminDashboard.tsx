import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  Category,
  People,
  ShoppingCart,
  Analytics,
  TrendingUp,
  AttachMoney,
  LocalShipping
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { SalesAnalytics } from '../../types/api';
import { ProductManagement } from './ProductManagement';
import { CategoryManagement } from './CategoryManagement';
import { UserManagement } from './UserManagement';
import { OrderManagement } from './OrderManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
      return;
    }

    if (isAdmin) {
      loadAnalytics();
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSalesAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError('Failed to load analytics data');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#e91e63', fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`Welcome, ${user?.fullName}`}
            color="primary"
            variant="outlined"
            sx={{ backgroundColor: '#fff' }}
          />
          <Chip
            label="Administrator"
            color="error"
            sx={{ backgroundColor: '#e91e63', color: 'white' }}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Overview Cards */}
      {analytics && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4
          }}
        >
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
                <Inventory sx={{ fontSize: 40, mr: 2 }} />
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
      )}

      {/* Tabs Navigation */}
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontWeight: 600,
            },
            '& .Mui-selected': {
              color: '#e91e63',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#e91e63',
            },
          }}
        >
          <Tab
            label="Overview"
            icon={<Dashboard />}
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab
            label="Products"
            icon={<Inventory />}
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab
            label="Categories"
            icon={<Category />}
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab
            label="Users"
            icon={<People />}
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab
            label="Orders"
            icon={<LocalShipping />}
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab
            label="Analytics"
            icon={<Analytics />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <AnalyticsDashboard analytics={analytics} onRefresh={loadAnalytics} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ProductManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <CategoryManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <UserManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <OrderManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <AnalyticsDashboard analytics={analytics} onRefresh={loadAnalytics} detailed />
      </TabPanel>
    </Container>
  );
}
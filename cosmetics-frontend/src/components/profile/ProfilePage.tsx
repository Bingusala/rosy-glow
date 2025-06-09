import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Home,
  Edit,
  Save,
  Cancel,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  }, [user, isAuthenticated, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    setSuccess('');
    // Reset form data to original user data
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement API call to update user profile
      // For now, just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // In a real implementation, you would update the user context here
      console.log('Profile update data:', formData);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} sx={{ color: '#e91e63' }} />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#e91e63', fontWeight: 'bold' }}>
        My Profile
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: '#e91e63',
              fontSize: '2rem',
              mr: 3
            }}
          >
            {getInitials(user.fullName)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {user.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              @{user.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {user.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  icon={role === 'ADMIN' ? <AdminPanelSettings /> : <Person />}
                  color={role === 'ADMIN' ? 'secondary' : 'primary'}
                  sx={{
                    backgroundColor: role === 'ADMIN' ? '#e91e63' : '#2196f3',
                    color: 'white'
                  }}
                />
              ))}
              <Chip
                label={user.active ? 'Active' : 'Inactive'}
                size="small"
                color={user.active ? 'success' : 'error'}
              />
            </Box>
          </Box>
          {!editing && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ color: '#e91e63', borderColor: '#e91e63' }}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Profile Form */}
        <Box component="form" onSubmit={(e) => e.preventDefault()}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Full Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Person sx={{ color: '#e91e63' }} />
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editing || loading}
                variant={editing ? "outlined" : "standard"}
                InputProps={{
                  readOnly: !editing
                }}
              />
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email sx={{ color: '#e91e63' }} />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing || loading}
                variant={editing ? "outlined" : "standard"}
                InputProps={{
                  readOnly: !editing
                }}
              />
            </Box>

            {/* Phone Number */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Phone sx={{ color: '#e91e63' }} />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!editing || loading}
                variant={editing ? "outlined" : "standard"}
                InputProps={{
                  readOnly: !editing
                }}
              />
            </Box>

            {/* Address */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Home sx={{ color: '#e91e63' }} />
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={editing ? 3 : 1}
                value={formData.address}
                onChange={handleChange}
                disabled={!editing || loading}
                variant={editing ? "outlined" : "standard"}
                InputProps={{
                  readOnly: !editing
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          {editing && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  backgroundColor: '#e91e63',
                  '&:hover': {
                    backgroundColor: '#c2185b'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>

        {/* Account Information */}
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Account Information
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2
        }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="body1">
              #{user.id}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Username
            </Typography>
            <Typography variant="body1">
              {user.username}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Account Status
            </Typography>
            <Typography variant="body1">
              {user.active ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Role(s)
            </Typography>
            <Typography variant="body1">
              {user.roles.join(', ')}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
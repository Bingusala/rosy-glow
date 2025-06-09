import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
  Info
} from '@mui/icons-material';
import { apiService } from '../../services/api';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  onImageRemoved?: () => void;
}

interface UploadRestrictions {
  maxFileSizeMB: number;
  maxWidthPx: number;
  maxHeightPx: number;
  minWidthPx: number;
  minHeightPx: number;
  allowedFormats: string[];
}

export function ImageUpload({ onImageUploaded, currentImageUrl, onImageRemoved }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [restrictions, setRestrictions] = useState<UploadRestrictions | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadRestrictions();
  }, []);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const loadRestrictions = async () => {
    try {
      const data = await apiService.getUploadRestrictions();
      setRestrictions(data);
    } catch (error) {
      console.error('Failed to load upload restrictions:', error);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!restrictions) return null;

    // Check file size
    const maxSizeBytes = restrictions.maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${restrictions.maxFileSizeMB}MB limit`;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${restrictions.allowedFormats.join(', ')}`;
    }

    return null;
  };

  const validateImageDimensions = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!restrictions) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        
        if (width < restrictions.minWidthPx || height < restrictions.minHeightPx) {
          resolve(`Image too small. Minimum: ${restrictions.minWidthPx}x${restrictions.minHeightPx}px`);
          return;
        }
        
        if (width > restrictions.maxWidthPx || height > restrictions.maxHeightPx) {
          resolve(`Image too large. Maximum: ${restrictions.maxWidthPx}x${restrictions.maxHeightPx}px`);
          return;
        }
        
        resolve(null);
      };
      
      img.onerror = () => resolve('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Basic validation
      const basicError = validateFile(file);
      if (basicError) {
        setError(basicError);
        setUploading(false);
        return;
      }

      // Dimension validation
      const dimensionError = await validateImageDimensions(file);
      if (dimensionError) {
        setError(dimensionError);
        setUploading(false);
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      const response = await apiService.uploadProductImage(file);
      onImageUploaded(response.fileUrl);
      setSuccess('Image uploaded successfully!');
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      
    } catch (error: any) {
      setError(error.response?.data?.error || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (onImageRemoved) {
      onImageRemoved();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      {/* Upload Restrictions Info */}
      {restrictions && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Info sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Image Upload Requirements:
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`Max Size: ${restrictions.maxFileSizeMB}MB`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Dimensions: ${restrictions.minWidthPx}x${restrictions.minHeightPx} - ${restrictions.maxWidthPx}x${restrictions.maxHeightPx}px`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`Formats: ${restrictions.allowedFormats.join(', ')}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Paper>
      )}

      {/* Current Image Preview */}
      {preview && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Product Image:
            </Typography>
            <IconButton
              onClick={handleRemoveImage}
              size="small"
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              overflow: 'hidden',
              maxHeight: 200
            }}
          >
            <img
              src={preview}
              alt="Product preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain'
              }}
            />
          </Box>
        </Paper>
      )}

      {/* Upload Area */}
      <Paper
        sx={{
          border: dragOver ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: dragOver ? '#f3f7ff' : '#fafafa',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#1976d2',
            bgcolor: '#f8f9fa'
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {uploading ? (
          <Box>
            <CircularProgress sx={{ color: '#1976d2' }} />
            <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
              Uploading image...
            </Typography>
          </Box>
        ) : (
          <Box>
            <CloudUpload sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {preview ? 'Change Image' : 'Upload Product Image'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              Drag and drop an image here, or click to select
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              sx={{ mt: 1 }}
            >
              Choose Image
            </Button>
          </Box>
        )}
      </Paper>

      {/* Success/Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
}
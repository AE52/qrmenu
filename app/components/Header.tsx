'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onLoginClick: () => void;
  isLoading?: boolean;
}

// Bu bileşeni artık kullanmıyoruz, NavbarLayout kullanıyoruz
export default function Header({ onLoginClick, isLoading = false }: HeaderProps) {
  return null;
} 
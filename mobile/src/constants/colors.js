import { Platform } from 'react-native';

export const COLORS = {
  // backgrounds
  BG_MAIN:     '#F9F8F6',
  BG_CARD:     '#EFE9E3',
  BG_BORDER:   '#D9CFC7',
  
  // accent
  ACCENT:      '#C9B59C',
  ACCENT_DARK: '#A8957E',  // pressed state
  
  // text
  TEXT_PRIMARY:   '#2D2D2D',
  TEXT_SECONDARY: '#6B6560',
  TEXT_ON_ACCENT: '#FFFFFF',
  TEXT_MUTED:     '#A8A09A',
  
  // status colors
  SUCCESS:  '#4CAF50',
  ERROR:    '#E53935',
  WARNING:  '#FF9800',
};

export const CARD_SHADOW = Platform.select({
  web: {
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  default: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
});

export default COLORS;

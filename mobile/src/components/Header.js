import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';
import useAuthStore from '../store/authStore';

export const Header = ({ title = 'SmartCart', showBack = false, onBack, rightAction }) => {
  const isCartConnected = useAuthStore((s) => s.isCartConnected);
  const cartId = useAuthStore((s) => s.cartId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.rightSection}>
          {rightAction ? (
            rightAction
          ) : (
            <View style={[styles.badge, isCartConnected ? styles.badgeConnected : styles.badgeDisconnected]}>
              <View style={[styles.dot, isCartConnected ? styles.dotConnected : styles.dotDisconnected]} />
              <Text style={styles.badgeText}>
                {isCartConnected ? `Cart #${cartId || '01'}` : 'Cart Offline'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.BG_CARD,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.BG_CARD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_BORDER,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeConnected: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: COLORS.SUCCESS,
  },
  badgeDisconnected: {
    backgroundColor: 'rgba(229, 57, 53, 0.08)',
    borderColor: COLORS.ERROR,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotConnected: {
    backgroundColor: COLORS.SUCCESS,
  },
  dotDisconnected: {
    backgroundColor: COLORS.ERROR,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
});

export default Header;

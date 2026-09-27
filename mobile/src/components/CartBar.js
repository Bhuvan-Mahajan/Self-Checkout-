import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, CARD_SHADOW } from '../constants/colors';
import useCartStore from '../store/cartStore';

export const CartBar = ({ onPress, actionLabel = 'VIEW CART →' }) => {
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItemCount = useCartStore((s) => s.getTotalItemCount);
  const isWeightVerified = useCartStore((s) => s.isWeightVerified());

  const count = getTotalItemCount();
  const totalPrice = getTotalPrice();

  if (count === 0) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.left}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count} {count === 1 ? 'ITEM' : 'ITEMS'}</Text>
          </View>
          <Text style={styles.price}>₹{totalPrice.toFixed(2)}</Text>
          <View style={styles.weightStatus}>
            <View
              style={[
                styles.weightDot,
                { backgroundColor: isWeightVerified ? COLORS.SUCCESS : COLORS.WARNING },
              ]}
            />
            <Text style={styles.weightText}>
              {isWeightVerified ? 'Scale Verified' : 'Scale Checking...'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: COLORS.BG_MAIN,
    borderTopWidth: 1,
    borderTopColor: COLORS.BG_BORDER,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.ACCENT,
    ...CARD_SHADOW,
  },
  left: {
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  countText: {
    color: COLORS.TEXT_ON_ACCENT,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  price: {
    color: COLORS.TEXT_ON_ACCENT,
    fontSize: 18,
    fontWeight: '700',
  },
  weightStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  weightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  weightText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.ACCENT_DARK,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CartBar;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, CARD_SHADOW } from '../constants/colors';

export const ProductCard = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.barcodeText}>📦</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.tagRow}>
          <Text style={styles.weightTag}>{item.weightGrams || 250}g</Text>
          <Text style={styles.barcodeSub}>UPC: {item.barcode}</Text>
        </View>
        <Text style={styles.price}>₹{(item.price * (item.quantity || 1)).toFixed(2)}</Text>
      </View>

      <View style={styles.controls}>
        {item.quantity > 0 ? (
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onDecrement?.(item.barcode)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepperText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={[styles.stepperBtn, styles.stepperBtnAccent]}
              onPress={() => onIncrement?.(item.barcode)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepperText, styles.stepperTextLight]}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onIncrement?.(item.barcode)}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  barcodeText: {
    fontSize: 26,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  weightTag: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    marginRight: 8,
  },
  barcodeSub: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  controls: {
    marginLeft: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    padding: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BG_CARD,
  },
  stepperBtnAccent: {
    backgroundColor: COLORS.ACCENT,
  },
  stepperText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  stepperTextLight: {
    color: COLORS.TEXT_ON_ACCENT,
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  addButton: {
    backgroundColor: COLORS.ACCENT,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.TEXT_ON_ACCENT,
    fontWeight: '700',
    fontSize: 13,
  },
});

export default ProductCard;

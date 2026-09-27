import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import useCartStore from '../store/cartStore';
import api from '../services/api';

export const CartScreen = ({ navigation }) => {
  const { cart, removeItem, getCurrentCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  // Auto-clear error toast after 2.5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch active cart on mount
  useEffect(() => {
    let isMounted = true;
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        await getCurrentCart();
      } catch (err) {
        console.warn('Failed to fetch cart on mount:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCart();
    return () => {
      isMounted = false;
    };
  }, []);

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalAmount = cart?.totalAmount ?? 0;
  const isFlagged = Boolean(cart?.isFlagged);

  // Handle Remove Item
  const handleRemove = async (productId) => {
    const id = typeof productId === 'object' && productId?._id ? productId._id : productId;
    try {
      await removeItem(id);
    } catch (err) {
      setError(err?.message || 'Failed to remove item');
    }
  };

  // Handle Quantity Increment
  const handleIncrement = async (item) => {
    const barcode = item.productId?.barcode || item.barcode;
    if (barcode) {
      try {
        await api.post('/api/cart/scan', { barcode, quantity: 1 });
        await getCurrentCart();
      } catch (err) {
        setError(err?.message || 'Failed to increase quantity');
      }
    } else {
      // Local fallback
      useCartStore.getState().updateQuantity(item.barcode || item._id, 1);
    }
  };

  // Handle Quantity Decrement
  const handleDecrement = async (item) => {
    const id = item.productId?._id || item.productId;
    if (item.quantity <= 1) {
      handleRemove(id);
    } else {
      // If the backend has no direct decrement endpoint, we remove and re-add or decrement locally
      useCartStore.getState().updateQuantity(item.barcode || item._id, -1);
    }
  };

  // Handle Checkout
  const handleCheckout = async () => {
    if (isFlagged || isCheckingOut || items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const response = await api.post('/api/cart/checkout');
      if (response && response.order) {
        navigation.navigate('Payment', { order: response.order });
      }
    } catch (err) {
      setError(err?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Render Individual Cart Item Card
  const renderItem = ({ item }) => {
    const pName = item.productName || item.name || 'Product';
    const weight = item.unitWeight || item.weightGrams || 0;
    const unitPriceRupees = (Number(item.unitPrice || 0) / 100).toFixed(0);
    const subtotalRupees = (Number(item.subtotal || 0) / 100).toFixed(0);
    const productId = item.productId?._id || item.productId;

    return (
      <View style={styles.itemCard}>
        {/* Left — product icon circle */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>📦</Text>
        </View>

        {/* Middle — product info */}
        <View style={styles.itemInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {pName}
          </Text>
          <Text style={styles.unitWeight}>{weight}g</Text>
          <Text style={styles.unitPrice}>₹{unitPriceRupees}</Text>
        </View>

        {/* Right — quantity controls + subtotal */}
        <View style={styles.itemActions}>
          <Text style={styles.subtotalText}>₹{subtotalRupees}</Text>

          {/* Quantity row */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleDecrement(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityNumber}>{item.quantity || 1}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleIncrement(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Remove button */}
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemove(productId)}
            activeOpacity={0.7}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Order Summary Card as FlatList Footer
  const renderFooter = () => {
    if (items.length === 0) return null;
    const formattedTotal = (Number(totalAmount || 0) / 100).toFixed(0);

    return (
      <View style={styles.footerContainer}>
        {/* ORDER SUMMARY CARD */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{formattedTotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{itemCount}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{formattedTotal}</Text>
          </View>
        </View>

        {/* Flagged Warning if isFlagged is true */}
        {isFlagged && (
          <Text style={styles.flaggedWarning}>
            ⚠️ Weight mismatch detected. Please rescan your items.
          </Text>
        )}

        {/* CHECKOUT BUTTON */}
        <TouchableOpacity
          style={[
            styles.checkoutBtn,
            (isFlagged || isCheckingOut) && styles.checkoutDisabled,
          ]}
          onPress={handleCheckout}
          disabled={isFlagged || isCheckingOut}
          activeOpacity={0.8}
        >
          {isCheckingOut ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />

      <View style={styles.innerContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Text style={styles.headerItemCount}>{itemCount} items</Text>
          </View>
        </View>

        {/* LOADING INDICATOR */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.ACCENT} />
          </View>
        ) : items.length === 0 ? (
          /* EMPTY STATE */
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start scanning items to add them
            </Text>

            <TouchableOpacity
              style={styles.startScanBtn}
              onPress={() => navigation.navigate('Scan')}
              activeOpacity={0.8}
            >
              <Text style={styles.startScanText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* CART ITEMS LIST (FlatList) */
          <FlatList
            data={items}
            keyExtractor={(item, index) =>
              item._id ||
              item.productId?._id ||
              item.productId ||
              item.barcode ||
              String(index)
            }
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        )}

        {/* ERROR TOAST */}
        {error && (
          <View style={styles.errorToast}>
            <Text style={styles.errorToastText}>{error}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_MAIN,
  },
  innerContainer: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BG_BORDER,
    marginBottom: 12,
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  headerItemCount: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
  },

  // LOADING STATE
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 8,
    textAlign: 'center',
  },
  startScanBtn: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startScanText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  // FLATLIST CONTENT
  listContent: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  // ITEM CARD
  itemCard: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.ACCENT + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  unitWeight: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  unitPrice: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  subtotalText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.BG_MAIN,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    lineHeight: 18,
  },
  quantityNumber: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
    color: COLORS.TEXT_PRIMARY,
  },
  removeBtn: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  removeText: {
    color: '#E53935',
    fontSize: 11,
    fontWeight: '600',
  },

  // FOOTER & ORDER SUMMARY
  footerContainer: {
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BG_BORDER,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },

  // FLAGGED WARNING
  flaggedWarning: {
    color: '#FF9800',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },

  // CHECKOUT BUTTON
  checkoutBtn: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  checkoutDisabled: {
    opacity: 0.5,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ERROR TOAST
  errorToast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#E53935',
    borderRadius: 10,
    padding: 12,
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  errorToastText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default CartScreen;

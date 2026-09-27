import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS } from '../constants/colors';
import useCartStore from '../store/cartStore';

export const SuccessScreen = ({ navigation, route }) => {
  const order = route?.params?.order || {};
  const exitQrCode = route?.params?.exitQrCode || order?.exitQrCode;
  const clearCart = useCartStore((s) => s.clearCart);

  const orderNumber =
    order.orderNumber ||
    (order._id ? `#${String(order._id).slice(-8).toUpperCase()}` : '#SC-89218');

  const items = order.items || [];
  const totalAmount = (Number(order.totalAmount || 0) / 100).toFixed(0);

  const handleDone = () => {
    clearCart();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerCard}>
          {/* SUCCESS ANIMATION (top) */}
          <View style={styles.topSection}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>

            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>
              Thank you for shopping with SmartCart
            </Text>
          </View>

          {/* ORDER SUMMARY CARD */}
          <View style={styles.summaryCard}>
            <View style={styles.orderNumberRow}>
              <Text style={styles.orderLabel}>Order</Text>
              <Text style={styles.orderValue}>{orderNumber}</Text>
            </View>

            <View style={styles.itemsList}>
              {items.map((item, index) => {
                const pName = item.productName || item.name || 'Product';
                const subtotal = (
                  Number(
                    item.subtotal != null
                      ? item.subtotal
                      : (item.unitPrice || 0) * (item.quantity || 1)
                  ) / 100
                ).toFixed(0);

                return (
                  <View
                    key={item._id || item.productId || String(index)}
                    style={styles.itemRow}
                  >
                    <Text style={styles.itemName} numberOfLines={1}>
                      {pName} {item.quantity > 1 ? `× ${item.quantity}` : ''}
                    </Text>
                    <Text style={styles.itemSubtotal}>₹{subtotal}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{totalAmount}</Text>
            </View>
          </View>

          {/* EXIT QR CODE SECTION */}
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>Exit QR Code</Text>

            <View style={styles.qrBox}>
              {exitQrCode ? (
                <View style={styles.qrContent}>
                  <Text style={styles.qrCodeIcon}>🏁</Text>
                  <Text style={styles.qrCodeText} numberOfLines={4}>
                    {exitQrCode}
                  </Text>
                </View>
              ) : (
                <View style={styles.qrContent}>
                  <Text style={styles.qrEmoji}>🔲</Text>
                  <Text style={styles.qrGenerating}>Generating...</Text>
                </View>
              )}
            </View>

            <Text style={styles.qrSubtitle}>
              Show this to exit the store
            </Text>
          </View>

          {/* DONE BUTTON */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            activeOpacity={0.85}
          >
            <Text style={styles.doneButtonText}>Done Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_MAIN,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  innerCard: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },

  // SUCCESS ANIMATION (top)
  topSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.ACCENT + '20',
    borderWidth: 3,
    borderColor: COLORS.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 48,
    color: COLORS.ACCENT,
    fontWeight: '700',
    lineHeight: 52,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 8,
  },

  // ORDER SUMMARY CARD
  summaryCard: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  orderNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  orderValue: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  itemsList: {
    paddingVertical: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    paddingRight: 10,
  },
  itemSubtotal: {
    fontSize: 13,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BG_BORDER,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  // EXIT QR CODE SECTION
  qrSection: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  qrBox: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 2,
    borderColor: COLORS.BG_BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  qrContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodeIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  qrCodeText: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    paddingHorizontal: 8,
    fontWeight: '500',
  },
  qrEmoji: {
    fontSize: 48,
  },
  qrGenerating: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 6,
  },
  qrSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    textAlign: 'center',
  },

  // DONE BUTTON
  doneButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SuccessScreen;

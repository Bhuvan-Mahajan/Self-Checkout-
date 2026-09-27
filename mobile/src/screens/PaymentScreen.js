import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { COLORS, CARD_SHADOW } from '../constants/colors';
import Header from '../components/Header';
import useCartStore from '../store/cartStore';

export const PaymentScreen = ({ navigation, route }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const cart = useCartStore((s) => s.cart);
  const items = useCartStore((s) => s.items);

  const orderFromRoute = route?.params?.order;
  const subtotal = orderFromRoute?.totalAmount
    ? Number(orderFromRoute.totalAmount) / 100
    : getTotalPrice();
  const grandTotal = subtotal > 0 ? subtotal : 10;

  const handlePay = () => {
    const orderData = orderFromRoute || {
      _id: 'SC-' + Math.floor(10000 + Math.random() * 90000),
      orderNumber: 'SC-' + Math.floor(10000 + Math.random() * 90000),
      items: cart?.items?.length ? cart.items : items,
      totalAmount: grandTotal * 100,
    };

    navigation.navigate('Success', {
      order: orderData,
      exitQrCode:
        orderData.exitQrCode ||
        'EXIT-CART-SC-' + Math.floor(100000 + Math.random() * 900000),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />
      <Header title="Checkout" showBack={true} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Total to pay banner */}
        <View style={styles.amountBanner}>
          <Text style={styles.amountBannerLabel}>TOTAL AMOUNT DUE</Text>
          <Text style={styles.amountBannerValue}>₹{grandTotal.toFixed(2)}</Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {[
          { id: 'upi', emoji: '⚡', title: 'Instant UPI (GPay / PhonePe / Paytm)', sub: 'Zero waiting, instant turnstile release' },
          { id: 'card', emoji: '💳', title: 'Credit / Debit Cards', sub: 'Visa, Mastercard, RuPay' },
          { id: 'wallet', emoji: '👛', title: 'SmartCart Wallet Balance', sub: 'Available: ₹1,250.00' },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.methodCardActive,
            ]}
            onPress={() => setSelectedMethod(method.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.methodEmoji}>{method.emoji}</Text>
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>{method.title}</Text>
              <Text style={styles.methodSub}>{method.sub}</Text>
            </View>
            <View style={[styles.radio, selectedMethod === method.id && styles.radioActive]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePay}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnText}>PAY ₹{grandTotal.toFixed(2)} NOW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BG_MAIN,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  amountBanner: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  amountBannerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
  },
  amountBannerValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.ACCENT_DARK,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  methodCardActive: {
    borderColor: COLORS.ACCENT,
    backgroundColor: '#FFFFFF',
  },
  methodEmoji: {
    fontSize: 24,
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  methodSub: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.BG_BORDER,
  },
  radioActive: {
    borderColor: COLORS.ACCENT,
    backgroundColor: COLORS.ACCENT,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.BG_MAIN,
    borderTopWidth: 1,
    borderTopColor: COLORS.BG_BORDER,
  },
  payBtn: {
    backgroundColor: COLORS.ACCENT,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: COLORS.TEXT_ON_ACCENT,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  receiptContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  receiptCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.SUCCESS,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  paidTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  paidAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.ACCENT_DARK,
    marginVertical: 4,
  },
  orderId: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginBottom: 20,
  },
  exitGatePass: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  gateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.TEXT_SECONDARY,
    letterSpacing: 1,
    marginBottom: 8,
  },
  qrPlaceholder: {
    alignItems: 'center',
    marginVertical: 8,
  },
  qrEmoji: {
    fontSize: 40,
  },
  qrText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 6,
  },
  cartUnlocked: {
    fontSize: 11,
    color: COLORS.SUCCESS,
    fontWeight: '700',
    marginTop: 8,
  },
  doneBtn: {
    backgroundColor: COLORS.ACCENT,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: COLORS.TEXT_ON_ACCENT,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default PaymentScreen;

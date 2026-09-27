import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { COLORS, CARD_SHADOW } from '../constants/colors';
import ProductCard from '../components/ProductCard';
import CartBar from '../components/CartBar';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export const HomeScreen = ({ navigation }) => {
  const items = useCartStore((s) => s.items);
  const sensorWeight = useCartStore((s) => s.sensorWeight);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const cartId = useAuthStore((s) => s.cartId);

  // Mock catalog items for quick testing without physical barcodes
  const sampleProducts = [
    { barcode: '8901030382345', name: 'Almond Milk 1L', price: 240, weightGrams: 1020 },
    { barcode: '8901233024890', name: 'Dark Chocolate 70%', price: 150, weightGrams: 100 },
    { barcode: '8902080004921', name: 'Organic Rolled Oats', price: 199, weightGrams: 500 },
  ];

  const handleAddItem = (product) => {
    useCartStore.getState().addItem(product);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Cart Connected Hero Banner Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroTitle}>Connected Cart</Text>
              <Text style={styles.heroSub}>{cartId || 'CART-42'} • BLE Active</Text>
            </View>
            <View style={styles.weightBadge}>
              <Text style={styles.weightNumber}>{sensorWeight}g</Text>
              <Text style={styles.weightLabel}>Scale Weight</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.scanCta}
            onPress={() => navigation.navigate('Scan')}
            activeOpacity={0.85}
          >
            <Text style={styles.scanCtaText}>📷  TAP TO SCAN BARCODE</Text>
          </TouchableOpacity>
        </View>

        {/* Active Scanned Items Section */}
        {items.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>In Your Cart ({items.length})</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <Text style={styles.seeAllText}>Full View →</Text>
              </TouchableOpacity>
            </View>
            {items.map((item) => (
              <ProductCard
                key={item.barcode}
                item={item}
                onIncrement={() => updateQuantity(item.barcode, 1)}
                onDecrement={() => updateQuantity(item.barcode, -1)}
              />
            ))}
          </View>
        )}

        {/* Quick Add / Popular Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Add / Test Products</Text>
          </View>
          {sampleProducts.map((p) => {
            const inCart = items.find((i) => i.barcode === p.barcode);
            return (
              <ProductCard
                key={p.barcode}
                item={inCart || { ...p, quantity: 0 }}
                onIncrement={() => handleAddItem(p)}
                onDecrement={() => updateQuantity(p.barcode, -1)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Bottom CartBar */}
      <CartBar onPress={() => navigation.navigate('Cart')} />
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
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    margin: 16,
    borderRadius: 18,
    padding: 18,
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  heroSub: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  weightBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
  },
  weightNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.ACCENT_DARK,
  },
  weightLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.TEXT_MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BG_BORDER,
    marginVertical: 14,
  },
  scanCta: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCtaText: {
    color: COLORS.TEXT_ON_ACCENT,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.ACCENT_DARK,
  },
});

export default HomeScreen;

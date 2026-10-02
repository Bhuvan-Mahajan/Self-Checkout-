import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../constants/colors';
import useCartStore from '../store/cartStore';
import api from '../services/api';

const STORE_ID = '6aa60f6ce6261c25ca8bb109';

export const ScanScreen = ({ navigation }) => {
  // Local state
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);

  // Camera permissions for mobile
  const [permission, requestPermission] = useCameraPermissions();

  // Cart store state & actions
  const { cart, setCart } = useCartStore();
  const itemCount = cart?.items?.length ?? 0;
  const totalAmount = cart?.totalAmount ?? 0;

  // Request camera permissions on mobile mount
  useEffect(() => {
    if (Platform.OS !== 'web' && !permission?.granted) {
      requestPermission();
    }
  }, []);

  // Auto-clear error toast after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Scan handler logic
  const handleScan = async ({ data }) => {
    const barcodeStr = data ? String(data).trim() : '';

    // 1. If isScanning or !barcode.trim() → return
    if (isScanning || !barcodeStr) return;

    // 2. setIsScanning(true)
    setIsScanning(true);

    // 3. Try:
    try {
      // a. GET /api/cart/current via api.get()
      const currentRes = await api.get('/api/cart/current');
      let activeCart = currentRes?.cart;

      // b. If response.cart is null: POST /api/cart/start body: { storeId: 'YOUR_STORE_ID' }
      if (!activeCart) {
        const startRes = await api.post('/api/cart/start', { storeId: STORE_ID });
        activeCart = startRes?.cart;
      }

      // c. POST /api/cart/scan body: { barcode: barcode.trim(), quantity: 1 }
      const scanRes = await api.post('/api/cart/scan', {
        barcode: barcodeStr,
        quantity: 1,
      });

      const updatedCart = scanRes?.cart;
      if (updatedCart && updatedCart.items && updatedCart.items.length > 0) {
        // d. setLastScanned(response.cart.items[last item])
        const lastItem = updatedCart.items[updatedCart.items.length - 1];
        setLastScanned(lastItem);

        // e. setShowResult(true)
        setShowResult(true);

        // f. Update cartStore with new cart
        if (setCart) {
          setCart(updatedCart);
        }

        // g. After 3000ms → setShowResult(false)
        setTimeout(() => {
          setShowResult(false);
        }, 3000);
      }

      setManualBarcode('');
    } catch (err) {
      // 4. Catch error → setError(error message)
      setError(err?.message || 'Failed to scan product');
    } finally {
      // 5. Finally → after 2000ms setIsScanning(false)
      setTimeout(() => {
        setIsScanning(false);
      }, 2000);
    }
  };

  // Reusable 4-corner bracket component
  const renderCornerBrackets = () => (
    <>
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />
    </>
  );

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />

      {/* MODE 2 (Mobile): Full screen CameraView background */}
      {Platform.OS !== 'web' && (
        <View style={StyleSheet.absoluteFillObject}>
          {permission?.granted ? (
            <CameraView
              onBarcodeScanned={handleScan}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'code128', 'qr'],
              }}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <View style={styles.permissionFallback}>
              <Text style={styles.permissionText}>
                {permission && !permission.granted
                  ? 'Camera permission denied. Please allow camera access in Settings.'
                  : 'Requesting camera permission...'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Inner Card Container */}
      <View style={styles.innerCard}>
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

          <Text style={styles.headerTitle}>Scan Item</Text>

          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{itemCount} items</Text>
          </View>
        </View>

        {/* SCANNER SECTION */}
        {Platform.OS === 'web' ? (
          /* MODE 1 — Web */
          <View style={styles.webScannerContainer}>
            {/* Top section (visual scanner feel) */}
            <View style={styles.webScannerVisual}>
              {renderCornerBrackets()}
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.manualEntryNotice}>Manual entry below</Text>
            </View>

            {/* Manual entry below scanner visual */}
            <TextInput
              style={styles.barcodeInput}
              placeholder="Enter barcode number"
              placeholderTextColor={COLORS.TEXT_MUTED}
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => handleScan({ data: manualBarcode })}
            />

            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.buttonDisabled]}
              onPress={() => handleScan({ data: manualBarcode })}
              disabled={isScanning}
              activeOpacity={0.8}
            >
              {isScanning ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.scanButtonText}>SCAN PRODUCT</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* MODE 2 — Mobile Viewfinder overlay */
          <View style={styles.mobileViewfinderContainer}>
            <View style={styles.mobileViewfinderBox}>
              {renderCornerBrackets()}
              <Text style={styles.mobileHintText}>Align barcode inside frame</Text>
            </View>
          </View>
        )}

        {/* PRODUCT RESULT CARD */}
        {showResult && lastScanned && (
          <View style={styles.resultCard}>
            <View style={styles.resultCardRow}>
              {/* Left icon circle */}
              <View style={styles.resultIconCircle}>
                <Text style={styles.resultIconEmoji}>📦</Text>
              </View>

              {/* Right info */}
              <View style={styles.resultInfo}>
                <Text style={styles.resultProductName} numberOfLines={1}>
                  {lastScanned.productName || lastScanned.name || 'Product'}
                </Text>
                <Text style={styles.resultPrice}>
                  ₹{(Number(lastScanned.unitPrice || 0) / 100).toFixed(0)}
                </Text>
                <Text style={styles.resultWeight}>
                  {lastScanned.unitWeight || 0}g
                </Text>
              </View>

              {/* Top right corner "✓ Added" badge */}
              <View style={styles.addedBadge}>
                <Text style={styles.addedBadgeText}>✓ Added</Text>
              </View>
            </View>
          </View>
        )}

        {/* Spacer to push Cart Bar to bottom */}
        <View style={styles.spacer} />

        {/* ERROR TOAST */}
        {error && (
          <View style={styles.errorToast}>
            <Text style={styles.errorToastText}>{error}</Text>
          </View>
        )}

        {/* CART BAR (bottom, always visible) */}
        <View style={styles.cartBar}>
          <View style={styles.cartBarLeft}>
            <Text style={styles.cartBarCount}>{itemCount} items in cart</Text>
            <Text style={styles.cartBarTotal}>
              ₹{(Number(totalAmount || 0) / 100).toFixed(0)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cartBarRight}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewCartText}>View Cart →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_MAIN,
  },
  innerCard: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  backButton: {
    padding: 6,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  cartBadge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  // MODE 1 — Web
  webScannerContainer: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.BG_BORDER,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  webScannerVisual: {
    height: 160,
    width: '100%',
    backgroundColor: '#F0EDE8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.BG_BORDER,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 32,
  },
  manualEntryNotice: {
    color: COLORS.TEXT_MUTED,
    fontSize: 12,
    marginTop: 8,
  },
  barcodeInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.BG_BORDER,
    padding: 14,
    marginTop: 16,
    width: '100%',
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
  },
  scanButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // MODE 2 — Mobile
  permissionFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.BG_MAIN,
  },
  permissionText: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  mobileViewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 280,
  },
  mobileViewfinderBox: {
    width: 240,
    height: 240,
    borderRadius: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  mobileHintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // CORNER BRACKETS
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.ACCENT,
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomRightRadius: 4,
  },

  // PRODUCT RESULT CARD
  resultCard: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.BG_BORDER,
    padding: 16,
    marginTop: 12,
    position: 'relative',
  },
  resultCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.ACCENT + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIconEmoji: {
    fontSize: 22,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 14,
    paddingRight: 60, // Space for top right added badge
  },
  resultProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  resultPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.ACCENT,
    marginTop: 2,
  },
  resultWeight: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  addedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addedBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },

  spacer: {
    flex: 1,
  },

  // ERROR TOAST
  errorToast: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
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

  // CART BAR
  cartBar: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 14,
    margin: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cartBarLeft: {
    justifyContent: 'center',
  },
  cartBarCount: {
    color: '#fff',
    fontSize: 12,
  },
  cartBarTotal: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  cartBarRight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default ScanScreen;

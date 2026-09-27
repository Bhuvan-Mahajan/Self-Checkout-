import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { COLORS, CARD_SHADOW } from '../constants/colors';

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const { login, isLoading, error: authError, clearError } = useAuthStore();

  const handleLogin = async () => {
    setValidationError('');
    const cleanPhone = phone.trim();

    // Validate: 10 digits required
    if (!/^\d{10}$/.test(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password) {
      setValidationError('Please enter your password');
      return;
    }

    // Call authStore login against backend
    await login(cleanPhone, password);
  };

  const displayError = validationError || authError;

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BG_MAIN} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Pill Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚡ SELF CHECKOUT</Text>
            </View>

            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.iconCircle}>
                <Text style={styles.cartEmoji}>🛒</Text>
              </View>

              <Text style={styles.appName}>SmartCart</Text>
              <Text style={styles.tagline}>Zero Queue. Zero Wait.</Text>
            </View>

            {/* Input Fields */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>MOBILE NUMBER</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={(val) => {
                    setPhone(val);
                    if (validationError) setValidationError('');
                    if (authError && clearError) clearError();
                  }}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.TEXT_MUTED}
                  secureTextEntry
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (validationError) setValidationError('');
                    if (authError && clearError) clearError();
                  }}
                />
              </View>

              {/* Error Message */}
              {displayError ? (
                <Text style={styles.errorText}>{displayError}</Text>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.TEXT_ON_ACCENT} />
                ) : (
                  <Text style={styles.loginButtonText}>LOGIN & START SHOPPING</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footerText}>
              New here? Register at the store counter
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.BG_MAIN,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 24 : 16,
  },
  card: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: COLORS.BG_BORDER,
    ...CARD_SHADOW,
  },
  badge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.TEXT_ON_ACCENT,
    letterSpacing: 0.5,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(201, 181, 156, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartEmoji: {
    fontSize: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 12,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.BG_BORDER,
    padding: 14,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 15,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_ON_ACCENT,
    letterSpacing: 0.5,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;

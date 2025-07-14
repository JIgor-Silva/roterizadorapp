import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Navigation, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../context/AuthContext';
const LoginScreen = () => {
  const [email, setEmail] = useState('entregador@loja.com');
  const [password, setPassword] = useState('123456');
  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
  }, [error]);

  const handleSubmit = () => {
    if (error) {
      clearError();
    }
    login(email, password);
  };

  return (
    <LinearGradient colors={['#2a2a2e', '#1c1c1e']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <LinearGradient colors={['#8a2be2', '#4b0082']} style={styles.logoBackground}>
                  <Navigation color="#fff" size={32} />
                </LinearGradient>
                <View>
                  <Text style={styles.mainTitle}>DeliveryRoute</Text>
                  <Text style={styles.subtitle}>Faça login para começar suas entregas</Text>
                </View>
              </View>
              <View style={styles.cardWrapper}>
                <BlurView style={styles.blurView} tint="dark" intensity={80} />
                <View style={styles.glassCard}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, styles.textWhite]}>Entrar</Text>
                    <Text style={[styles.cardDescription, styles.textGray]}>
                      Digite suas credenciais para acessar
                    </Text>
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.form}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.textWhite}>Email</Text>
                        <TextInput
                          placeholder="seu@email.com"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          style={styles.input}
                          placeholderTextColor="#d1d5db"
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.textWhite}>Senha</Text>
                        <TextInput
                          placeholder="Sua senha"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          style={styles.input}
                          placeholderTextColor="#d1d5db"
                        />
                      </View>
                      {error && (
                        <View style={styles.errorContainer}>
                          <Text style={styles.errorText}>{error}</Text>
                        </View>
                      )}
                      <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.submitButton}>
                        <LinearGradient colors={['#8a2be2', '#4b0082']} style={StyleSheet.absoluteFill} />
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.buttonText}>Entrando...</Text>
                          </View>
                        ) : (
                          <View style={styles.loadingContainer}>
                            <Text style={styles.buttonText}>Entrar</Text>
                            <ArrowRight color="#fff" size={18} />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.demoBox}>
                      <Text style={styles.demoText}>Credenciais de demonstração:</Text>
                      <Text style={styles.demoCredentials}>Admin: admin@loja.com</Text>
                      <Text style={styles.demoCredentials}>Entregador: entregador@loja.com</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

LoginScreen.displayName = "LoginScreen";

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  innerContainer: { width: '100%', maxWidth: 450, alignSelf: 'center', padding: 16, gap: 32 },
  titleContainer: { alignItems: 'center', gap: 16 },
  logoBackground: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#d1d5db', textAlign: 'center', marginTop: 8 },
  cardWrapper: { borderRadius: 12, overflow: 'hidden' },
  blurView: { ...StyleSheet.absoluteFillObject },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'transparent',
  },
  cardHeader: { padding: 16, alignItems: 'center' },
  cardContent: { padding: 16, gap: 16 },
  cardTitle: { fontSize: 24, textAlign: 'center' },
  cardDescription: { textAlign: 'center' },
  textWhite: { color: '#fff' },
  textGray: { color: '#d1d5db' },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    color: '#fff',
    fontSize: 16,
  },
  submitButton: { height: 50, borderRadius: 12, overflow: 'hidden' },
  loadingContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  demoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  demoText: { fontSize: 12, color: '#d1d5db', textAlign: 'center', marginBottom: 4 },
  demoCredentials: { fontSize: 12, color: '#fff', textAlign: 'center' },
});

export default LoginScreen;


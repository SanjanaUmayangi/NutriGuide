// // app/index.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useRouter } from 'expo-router';
// import { useEffect } from 'react';

// export default function Index() {
//   const router = useRouter();
//   const token = useSelector((s: any) => s.auth.token);

//   useEffect(() => {
//     // If logged in go to tabs, else go to auth login
//     if (token) router.replace('/(tabs)');
//     else router.replace('/auth/login');
//   }, [token]);

//   return null;
// }

// app/index.tsx
import { Link, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header/Logo Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.appName}>NutriGuide+</Text>
            <Text style={styles.tagline}>Your Personal Nutrition Companion</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Welcome Section */}
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#2E7D32', '#4CAF50']}
              style={styles.gradientCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.welcomeTitle}>Welcome!</Text>
              {/* <Text style={styles.welcomeText}>
                Track your nutrition, discover healthy foods, and achieve your wellness goals with our comprehensive guide.
              </Text> */}
            </LinearGradient>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            
            <View style={styles.featuresRow}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: '#E8F5E8' }]}>
                  <Text style={[styles.featureEmoji, { color: '#2E7D32' }]}>📊</Text>
                </View>
                <Text style={styles.featureTitle}>Nutrition Tracking</Text>
                <Text style={styles.featureDescription}>Monitor your daily intake</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.featureEmoji, { color: '#1976D2' }]}>🍎</Text>
                </View>
                <Text style={styles.featureTitle}>Food Database</Text>
                <Text style={styles.featureDescription}>Discover healthy options</Text>
              </View>
            </View>

            <View style={styles.featuresRow}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.featureEmoji, { color: '#FF9800' }]}>💡</Text>
                </View>
                <Text style={styles.featureTitle}>Smart Tips</Text>
                <Text style={styles.featureDescription}>Personalized advice</Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Text style={[styles.featureEmoji, { color: '#7B1FA2' }]}>📈</Text>
                </View>
                <Text style={styles.featureTitle}>Progress Insights</Text>
                <Text style={styles.featureDescription}>Track your journey</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Link href="/auth/register" asChild>
              <Pressable style={styles.primaryButton}>
                <LinearGradient
                  colors={['#2E7D32', '#4CAF50']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </Pressable>
            </Link>
            
            <Link href="/auth/login" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>I already have an account</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#F8FDF8',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  welcomeCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  gradientCard: {
    padding: 24,
    borderRadius: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  featuresGrid: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsSection: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#2E7D32',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
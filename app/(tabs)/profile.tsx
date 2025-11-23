import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { logout } from '../../lib/redux/slices/authSlice';
import { toggleTheme } from '../../lib/redux/slices/themeSlice';
import { clearFavourites } from '../../lib/redux/slices/favouriteSlice';
import { clearTracker } from '../../lib/redux/slices/calorieSlice';
import { Feather } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

export default function Profile() {
  const dispatch = useAppDispatch();
  const { username, email } = useAppSelector(state => state.auth);
  const favourites = useAppSelector(state => state.favourites.items);
  const trackerItems = useAppSelector(state => state.calories.items);
  const { theme, isDark } = useTheme(); // 🆕 Use theme hook

  // Calculate stats
  const totalFavourites = favourites.length;
  const totalTracked = trackerItems.length;
  const totalCalories = trackerItems.reduce((sum, item) => sum + (item.calories || 0), 0);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logout())
        },
      ]
    );
  };

  const handleClearFavourites = () => {
    Alert.alert(
      'Clear Favourites',
      'Are you sure you want to remove all favourites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => dispatch(clearFavourites())
        },
      ]
    );
  };

  const handleClearTracker = () => {
    Alert.alert(
      'Clear Tracker',
      'Are you sure you want to clear your calorie tracker?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => dispatch(clearTracker())
        },
      ]
    );
  };

  
type FeatherIconName = 
  | "sun" 
  | "moon" 
  | "heart" 
  | "activity" 
  | "info" 
  | "user" 
  | "shield" 
  | "help-circle" 
  | "log-out" 
  | "chevron-right";

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    isDestructive = false 
  }: {
    icon: FeatherIconName;
    title: string;
    subtitle?: string;
    onPress: () => void;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        { borderBottomColor: theme.border }
      ]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Feather 
          name={icon} 
          size={22} 
          color={isDestructive ? theme.error : theme.textSecondary} 
        />
        <View style={styles.settingText}>
          <Text style={[
            styles.settingTitle,
            { color: isDestructive ? theme.error : theme.text },
            isDestructive && styles.destructiveText
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={18} color={theme.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        </View>
        <Text style={[styles.username, { color: theme.text }]}>
          {username || 'Guest User'}
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {email || 'Welcome to NutriGuide+'}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>
          Your Progress
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {totalFavourites}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Favourites
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {totalTracked}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Foods Tracked
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.primary }]}>
              {totalCalories}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Total Calories
            </Text>
          </View>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Preferences
        </Text>
        
        <View style={[styles.settingsList, { backgroundColor: theme.surface }]}>
          <SettingItem
            icon={isDark ? "sun" : "moon"}
            title="Dark Mode"
            subtitle={`Current: ${isDark ? 'On' : 'Off'}`}
            onPress={() => dispatch(toggleTheme())}
          />
          
          <SettingItem
            icon="heart"
            title="Clear Favourites"
            subtitle={`${totalFavourites} items`}
            onPress={handleClearFavourites}
          />
          
          <SettingItem
            icon="activity"
            title="Clear Tracker"
            subtitle="Reset daily calories"
            onPress={handleClearTracker}
          />
          
          <SettingItem
            icon="info"
            title="About"
            subtitle="App version 1.0.0"
            onPress={() => Alert.alert('About', 'NutriGuide+ v1.0.0\nYour personal nutrition tracker')}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Account
        </Text>
        
        <View style={[styles.settingsList, { backgroundColor: theme.surface }]}>
          <SettingItem
            icon="user"
            title="Edit Profile"
            subtitle="Update your information"
            onPress={() => Alert.alert('Coming Soon', 'Profile editing feature coming soon!')}
          />
          
          <SettingItem
            icon="shield"
            title="Privacy & Security"
            subtitle="Manage your data"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
          />
          
          <SettingItem
            icon="help-circle"
            title="Help & Support"
            subtitle="Get assistance"
            onPress={() => Alert.alert('Support', 'Contact us: support@nutriguide.com')}
          />

          <SettingItem
            icon="log-out"
            title="Logout"
            onPress={handleLogout}
            isDestructive={true}
          />
        </View>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          NutriGuide+ • v1.0.0
        </Text>
        <Text style={[styles.footerSubtext, { color: theme.textTertiary }]}>
          Your personal nutrition companion
        </Text>
      </View>
    </ScrollView>
  );
}

// 🆕 Update styles to use theme variables
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  settingsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsList: {
    borderRadius: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  destructiveText: {
    // Color handled inline
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
});
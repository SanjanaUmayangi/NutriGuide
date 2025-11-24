// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
// import { logout } from '../../lib/redux/slices/authSlice';
// import { toggleTheme } from '../../lib/redux/slices/themeSlice';
// import { clearFavourites } from '../../lib/redux/slices/favouriteSlice';
// import { clearTracker } from '../../lib/redux/slices/calorieSlice';
// import { Feather } from '@expo/vector-icons';
// import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

// export default function Profile() {
//   const dispatch = useAppDispatch();
//   const { username, email } = useAppSelector(state => state.auth);
//   const favourites = useAppSelector(state => state.favourites.items);
//   const trackerItems = useAppSelector(state => state.calories.items);
//   const { theme, isDark } = useTheme(); // 🆕 Use theme hook

//   // Calculate stats
//   const totalFavourites = favourites.length;
//   const totalTracked = trackerItems.length;
//   const totalCalories = trackerItems.reduce((sum, item) => sum + (item.calories || 0), 0);

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Logout', 
//           style: 'destructive',
//           onPress: () => dispatch(logout())
//         },
//       ]
//     );
//   };

//   const handleClearFavourites = () => {
//     Alert.alert(
//       'Clear Favourites',
//       'Are you sure you want to remove all favourites?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Clear All', 
//           style: 'destructive',
//           onPress: () => dispatch(clearFavourites())
//         },
//       ]
//     );
//   };

//   const handleClearTracker = () => {
//     Alert.alert(
//       'Clear Tracker',
//       'Are you sure you want to clear your calorie tracker?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { 
//           text: 'Clear', 
//           style: 'destructive',
//           onPress: () => dispatch(clearTracker())
//         },
//       ]
//     );
//   };

  
// type FeatherIconName = 
//   | "sun" 
//   | "moon" 
//   | "heart" 
//   | "activity" 
//   | "info" 
//   | "user" 
//   | "shield" 
//   | "help-circle" 
//   | "log-out" 
//   | "chevron-right";

//   const SettingItem = ({ 
//     icon, 
//     title, 
//     subtitle, 
//     onPress, 
//     isDestructive = false 
//   }: {
//     icon: FeatherIconName;
//     title: string;
//     subtitle?: string;
//     onPress: () => void;
//     isDestructive?: boolean;
//   }) => (
//     <TouchableOpacity 
//       style={[
//         styles.settingItem,
//         { borderBottomColor: theme.border }
//       ]}
//       onPress={onPress}
//     >
//       <View style={styles.settingLeft}>
//         <Feather 
//           name={icon} 
//           size={22} 
//           color={isDestructive ? theme.error : theme.textSecondary} 
//         />
//         <View style={styles.settingText}>
//           <Text style={[
//             styles.settingTitle,
//             { color: isDestructive ? theme.error : theme.text },
//             isDestructive && styles.destructiveText
//           ]}>
//             {title}
//           </Text>
//           {subtitle && (
//             <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
//               {subtitle}
//             </Text>
//           )}
//         </View>
//       </View>
//       <Feather name="chevron-right" size={18} color={theme.textTertiary} />
//     </TouchableOpacity>
//   );

//   return (
//     <ScrollView 
//       style={[styles.container, { backgroundColor: theme.background }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header Section */}
//       <View style={[styles.header, { backgroundColor: theme.surface }]}>
//         <View style={styles.avatarContainer}>
//           <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
//             <Text style={styles.avatarText}>
//               {username ? username.charAt(0).toUpperCase() : 'U'}
//             </Text>
//           </View>
//         </View>
//         <Text style={[styles.username, { color: theme.text }]}>
//           {username || 'Guest User'}
//         </Text>
//         <Text style={[styles.email, { color: theme.textSecondary }]}>
//           {email || 'Welcome to NutriGuide+'}
//         </Text>
//       </View>

//       {/* Stats Section */}
//       <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
//         <Text style={[styles.statsTitle, { color: theme.text }]}>
//           Your Progress
//         </Text>
//         <View style={styles.statsGrid}>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: theme.primary }]}>
//               {totalFavourites}
//             </Text>
//             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//               Favourites
//             </Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: theme.primary }]}>
//               {totalTracked}
//             </Text>
//             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//               Foods Tracked
//             </Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: theme.primary }]}>
//               {totalCalories}
//             </Text>
//             <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
//               Total Calories
//             </Text>
//           </View>
//         </View>
//       </View>

//       {/* Settings Section */}
//       <View style={styles.settingsSection}>
//         <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
//           Preferences
//         </Text>
        
//         <View style={[styles.settingsList, { backgroundColor: theme.surface }]}>
//           <SettingItem
//             icon={isDark ? "sun" : "moon"}
//             title="Dark Mode"
//             subtitle={`Current: ${isDark ? 'On' : 'Off'}`}
//             onPress={() => dispatch(toggleTheme())}
//           />
          
//           <SettingItem
//             icon="heart"
//             title="Clear Favourites"
//             subtitle={`${totalFavourites} items`}
//             onPress={handleClearFavourites}
//           />
          
//           <SettingItem
//             icon="activity"
//             title="Clear Tracker"
//             subtitle="Reset daily calories"
//             onPress={handleClearTracker}
//           />
          
//           <SettingItem
//             icon="info"
//             title="About"
//             subtitle="App version 1.0.0"
//             onPress={() => Alert.alert('About', 'NutriGuide+ v1.0.0\nYour personal nutrition tracker')}
//           />
//         </View>
//       </View>

//       {/* Account Section */}
//       <View style={styles.settingsSection}>
//         <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
//           Account
//         </Text>
        
//         <View style={[styles.settingsList, { backgroundColor: theme.surface }]}>
//           <SettingItem
//             icon="user"
//             title="Edit Profile"
//             subtitle="Update your information"
//             onPress={() => Alert.alert('Coming Soon', 'Profile editing feature coming soon!')}
//           />
          
//           <SettingItem
//             icon="shield"
//             title="Privacy & Security"
//             subtitle="Manage your data"
//             onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
//           />
          
//           <SettingItem
//             icon="help-circle"
//             title="Help & Support"
//             subtitle="Get assistance"
//             onPress={() => Alert.alert('Support', 'Contact us: support@nutriguide.com')}
//           />

//           <SettingItem
//             icon="log-out"
//             title="Logout"
//             onPress={handleLogout}
//             isDestructive={true}
//           />
//         </View>
//       </View>

//       {/* App Info */}
//       <View style={styles.footer}>
//         <Text style={[styles.footerText, { color: theme.textSecondary }]}>
//           NutriGuide+ • v1.0.0
//         </Text>
//         <Text style={[styles.footerSubtext, { color: theme.textTertiary }]}>
//           Your personal nutrition companion
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// // 🆕 Update styles to use theme variables
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     alignItems: 'center',
//     padding: 24,
//     borderBottomWidth: 1,
//   },
//   avatarContainer: {
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   avatarText: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#FFFFFF',
//   },
//   username: {
//     fontSize: 24,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   email: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   statsCard: {
//     margin: 16,
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   statsTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: '800',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     textAlign: 'center',
//   },
//   settingsSection: {
//     marginTop: 8,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 16,
//     marginBottom: 8,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   settingsList: {
//     borderRadius: 0,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   settingText: {
//     marginLeft: 12,
//     flex: 1,
//   },
//   settingTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   settingSubtitle: {
//     fontSize: 14,
//     marginTop: 2,
//   },
//   destructiveText: {
//     // Color handled inline
//   },
//   footer: {
//     alignItems: 'center',
//     padding: 24,
//     marginTop: 16,
//   },
//   footerText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   footerSubtext: {
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

export default function Profile() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const router = useRouter();

  console.log('Profile - User:', user); // Debug log
  console.log('Profile - isAuthenticated:', isAuthenticated); // Debug log

  const handleLogout = () => {
    console.log('Logout button pressed'); // Debug log
    
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => console.log('Logout cancelled') // Debug log
        },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            console.log('Logout confirmed'); // Debug log
            try {
              await signOut(); // Wait for signOut to complete
              console.log('SignOut completed'); // Debug log
              console.log('Current isAuthenticated after logout:', isAuthenticated); // Debug log
              
              // Use replace to prevent going back to profile
              router.replace('/auth/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, isLast = false }: any) => (
    <TouchableOpacity
      style={[
        s.menuItem,
        { backgroundColor: theme.surface },
        !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border }
      ]}
      onPress={onPress}
    >
      <View style={s.menuLeft}>
        <Feather name={icon} size={22} color={theme.primary} />
        <View style={s.menuText}>
          <Text style={[s.menuTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[s.menuSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[s.container, { backgroundColor: theme.background }]}>
      {/* Header */}
<View style={[s.header, { backgroundColor: theme.surface }]}>
  <View style={s.avatarContainer}>
    {user?.image ? (
      <Image source={{ uri: user.image }} style={s.avatar} />
    ) : (
      <View style={[s.avatarPlaceholder, { backgroundColor: theme.primary }]}>
        <Text style={s.avatarText}>
          {user?.firstName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>
    )}
  </View>
  <Text style={[s.userName, { color: theme.text }]}>
    {user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.name || 'User'
    }
  </Text>
  <Text style={[s.userEmail, { color: theme.textSecondary }]}>
    {user?.email || 'user@example.com'}
  </Text>
  {user?.username && (
    <Text style={[s.userUsername, { color: theme.textTertiary }]}>
      @{user.username}
    </Text>
  )}
</View>

      {/* Menu Items */}
      <View style={[s.menu, { backgroundColor: theme.surface }]}>
        <MenuItem
          icon="user"
          title="Personal Information"
          subtitle="Update your profile details"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing feature coming soon!')}
        />
        <MenuItem
          icon="bell"
          title="Notifications"
          subtitle="Manage your notifications"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings coming soon!')}
        />
        <MenuItem
          icon="shield"
          title="Privacy & Security"
          subtitle="Control your data and privacy"
          onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
        />
        <MenuItem
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help and contact support"
          onPress={() => Alert.alert('Coming Soon', 'Help center coming soon!')}
        />
      </View>

      {/* Preferences */}
      <View style={[s.section, { backgroundColor: theme.surface }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>Preferences</Text>
        
        <TouchableOpacity
          style={[s.preferenceItem, { borderBottomColor: theme.border }]}
          onPress={toggleTheme}
        >
          <View style={s.preferenceLeft}>
            <Feather name={isDark ? 'sun' : 'moon'} size={22} color={theme.primary} />
            <Text style={[s.preferenceText, { color: theme.text }]}>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={[s.section, { backgroundColor: theme.surface }]}>
        <Text style={[s.sectionTitle, { color: theme.text }]}>App Information</Text>
        
        <MenuItem
          icon="info"
          title="About NutriGuide+"
          subtitle="Version 1.0.0"
          onPress={() => Alert.alert('About', 'NutriGuide+ v1.0.0\nHealth & Wellness App')}
          isLast={true}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[s.logoutButton, { backgroundColor: theme.error + '15' }]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={theme.error} />
        <Text style={[s.logoutText, { color: theme.error }]}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={[s.footerText, { color: theme.textSecondary }]}>
          NutriGuide+ © 2025
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  menu: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    marginLeft: 12,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    padding: 16,
    paddingBottom: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 14,
  },
  userUsername: {
  fontSize: 14,
  //color: theme.textTertiary,
  marginTop: 2,
},
});
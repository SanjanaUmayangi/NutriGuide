import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavourite, clearFavourites } from '../../lib/redux/slices/favouriteSlice';
import FoodCard from '../../components/FoodCard';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

export default function Favourites() {
  const favourites = useSelector((state: any) => state.favourites.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme(); // 🆕 Get theme

  const handleRemoveFavourite = (item: any) => {
    dispatch(removeFavourite(item.name));
  };

  const handleClearAll = () => {
    if (favourites.length === 0) return;
    
    Alert.alert(
      'Clear All Favourites',
      'Are you sure you want to remove all items from your favourites?',
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

  const EmptyState = () => (
    <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.surface }]}>
        <Feather name="heart" size={64} color={theme.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favourites Yet</Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Foods you add to favourites will appear here for quick access.
      </Text>
      <TouchableOpacity 
        style={[styles.browseButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={[styles.browseButtonText, { color: theme.textInverse }]}>Browse Foods</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Favourites</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {favourites.length} saved item{favourites.length !== 1 ? 's' : ''}
          </Text>
        </View>
        {favourites.length > 0 && (
          <TouchableOpacity 
            style={[styles.clearButton, { 
              backgroundColor: theme.error + '20', 
              borderColor: theme.error + '40' 
            }]}
            onPress={handleClearAll}
          >
            <Feather name="trash-2" size={20} color={theme.error} />
            <Text style={[styles.clearButtonText, { color: theme.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Favourites List */}
      <FlatList
        data={favourites}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <FoodCard 
            item={item} 
            onPress={() => router.push(`/product/${encodeURIComponent(item.name)}`)} 
            showFavouriteButton={false}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favourites.length === 0 && styles.emptyListContent}
        ListEmptyComponent={EmptyState}
        ListHeaderComponent={favourites.length > 0 ? <View style={styles.listHeader} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearButtonText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  browseButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
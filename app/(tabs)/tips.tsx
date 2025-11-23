import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import {
  fetchTips,
  fetchCategories,
  searchTips,
  setSelectedCategory,
  setSearchQuery,
  clearSearch,
  fetchBookmarkedTips, // Add this import
} from '../../lib/redux/slices/tipsSlice';
import { Feather } from '@expo/vector-icons';
import TipCard from '../../components/TipCard';
import { Tip } from '../../types/api';

export default function Tips() {
  const dispatch = useAppDispatch();
  const {
    items: tips,
    categories,
    selectedCategory,
    searchQuery,
    loading,
    error,
    bookmarkedTips,
  } = useAppSelector(state => state.tips);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Enhanced categories including "Saved"
  const enhancedCategories = ['All', 'Saved', ...categories.filter(cat => cat !== 'All')];

  // Load tips and categories on mount
  useEffect(() => {
    dispatch(fetchTips());
    dispatch(fetchCategories());
  }, []);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
    
    if (category === 'All') {
      dispatch(fetchTips());
    } else if (category === 'Saved') {
      // Show only bookmarked tips
      dispatch(fetchBookmarkedTips());
    } else {
      dispatch(fetchTips(category));
    }
  };

  // Handle search
  const handleSearch = (text: string) => {
    setLocalSearch(text);
    dispatch(setSearchQuery(text));
    
    if (text.trim()) {
      dispatch(searchTips(text));
    } else {
      // When clearing search, go back to current category
      if (selectedCategory === 'All') {
        dispatch(fetchTips());
      } else if (selectedCategory === 'Saved') {
        dispatch(fetchBookmarkedTips());
      } else {
        dispatch(fetchTips(selectedCategory));
      }
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearch('');
    dispatch(clearSearch());
    
    if (selectedCategory === 'All') {
      dispatch(fetchTips());
    } else if (selectedCategory === 'Saved') {
      dispatch(fetchBookmarkedTips());
    } else {
      dispatch(fetchTips(selectedCategory));
    }
  };

  // Refresh tips based on current category
  const handleRefresh = () => {
    if (selectedCategory === 'All') {
      dispatch(fetchTips());
    } else if (selectedCategory === 'Saved') {
      dispatch(fetchBookmarkedTips());
    } else {
      dispatch(fetchTips(selectedCategory));
    }
  };

  // Render category filter chips
  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
        category === 'Saved' && styles.savedCategoryChip,
      ]}
      onPress={() => handleCategoryChange(category)}
    >
      {category === 'Saved' && (
        <Feather 
          name="bookmark" 
          size={12} 
          color={selectedCategory === 'Saved' ? '#fff' : '#4CAF50'} 
          style={styles.savedIcon}
        />
      )}
      <Text
        style={[
          styles.categoryChipText,
          selectedCategory === category && styles.categoryChipTextActive,
        ]}
      >
        {category}
        {category === 'Saved' && ` (${bookmarkedTips.length})`}
      </Text>
    </TouchableOpacity>
  );

  const renderTipItem = ({ item }: { item: Tip }) => (
    <TipCard tip={item} />
  );

  // Get the tips to display based on current view
  const displayTips = selectedCategory === 'Saved' 
    ? tips.filter(tip => bookmarkedTips.includes(tip.id))
    : tips;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Wellness Tips</Text>
        <Text style={styles.subtitle}>
          Expert advice for your health journey
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tips..."
          value={localSearch}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {localSearch ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Feather name="x" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {enhancedCategories.map(renderCategoryChip)}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{displayTips.length}</Text>
          <Text style={styles.statLabel}>
            {selectedCategory === 'Saved' ? 'Saved' : 'Tips'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{bookmarkedTips.length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
      </View>

      {/* Tips List */}
      <FlatList
        data={displayTips}
        renderItem={renderTipItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather 
              name={selectedCategory === 'Saved' ? "bookmark" : "info"} 
              size={48} 
              color="#CCCCCC" 
            />
            <Text style={styles.emptyTitle}>
              {loading 
                ? 'Loading Tips...' 
                : selectedCategory === 'Saved' 
                  ? 'No Saved Tips'
                  : 'No Tips Found'
              }
            </Text>
            <Text style={styles.emptyText}>
              {selectedCategory === 'Saved' 
                ? 'Bookmark tips you find helpful to see them here!'
                : searchQuery
                  ? 'Try adjusting your search terms'
                  : 'No tips available for this category'
              }
            </Text>
            {selectedCategory === 'Saved' && tips.length > 0 && (
              <TouchableOpacity 
                style={styles.browseButton}
                onPress={() => handleCategoryChange('All')}
              >
                <Text style={styles.browseButtonText}>Browse All Tips</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={20} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7F9',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E1E1E',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#4CAF50',
  },
  savedCategoryChip: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  savedIcon: {
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    lineHeight: 20,
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#D32F2F',
    marginLeft: 8,
    flex: 1,
  },
});
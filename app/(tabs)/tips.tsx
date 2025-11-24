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
  fetchBookmarkedTips,
} from '../../lib/redux/slices/tipsSlice';
import { Feather } from '@expo/vector-icons';
import TipCard from '../../components/TipCard';
import { Tip } from '../../types/api';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

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
  const { theme } = useTheme(); // 🆕 Get theme

  // Enhanced categories including "Saved"
  const enhancedCategories = ['All', 'Saved', ...categories.filter(cat => cat !== 'All')];

  // Load tips and categories on mount
  useEffect(() => {
    dispatch(fetchTips());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
    
    if (category === 'All') {
      dispatch(fetchTips());
    } else if (category === 'Saved') {
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
        { backgroundColor: theme.surface },
        selectedCategory === category && [styles.categoryChipActive, { backgroundColor: theme.primary }],
        category === 'Saved' && { borderColor: theme.primary },
      ]}
      onPress={() => handleCategoryChange(category)}
    >
      {category === 'Saved' && (
        <Feather 
          name="bookmark" 
          size={12} 
          color={selectedCategory === 'Saved' ? theme.textInverse : theme.primary} 
          style={styles.savedIcon}
        />
      )}
      <Text
        style={[
          styles.categoryChipText,
          { color: theme.textSecondary },
          selectedCategory === category && [styles.categoryChipTextActive, { color: theme.textInverse }],
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Wellness Tips</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Expert advice for your health journey
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <Feather name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search tips..."
          placeholderTextColor={theme.textSecondary}
          value={localSearch}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {localSearch ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Feather name="x" size={20} color={theme.textSecondary} />
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
      <View style={[styles.statsContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{displayTips.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            {selectedCategory === 'Saved' ? 'Saved' : 'Tips'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{bookmarkedTips.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{categories.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Categories</Text>
        </View>
      </View>

      {/* Tips List */}
      <FlatList
        data={displayTips}
        renderItem={renderTipItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={handleRefresh}
            colors={[theme.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather 
              name={selectedCategory === 'Saved' ? "bookmark" : "info"} 
              size={48} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {loading 
                ? 'Loading Tips...' 
                : selectedCategory === 'Saved' 
                  ? 'No Saved Tips'
                  : 'No Tips Found'
              }
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {selectedCategory === 'Saved' 
                ? 'Bookmark tips you find helpful to see them here!'
                : searchQuery
                  ? 'Try adjusting your search terms'
                  : 'No tips available for this category'
              }
            </Text>
            {selectedCategory === 'Saved' && tips.length > 0 && (
              <TouchableOpacity 
                style={[styles.browseButton, { backgroundColor: theme.primary }]}
                onPress={() => handleCategoryChange('All')}
              >
                <Text style={[styles.browseButtonText, { color: theme.textInverse }]}>Browse All Tips</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* Error Message */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.error + '20' }]}>
          <Feather name="alert-triangle" size={20} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryChipActive: {
    // Styles handled inline
  },
  savedIcon: {
    marginRight: 4,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    // Styles handled inline
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    flex: 1,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../lib/redux/hooks';
import { fetchFoods } from '../../lib/redux/slices/foodSlice';
import FoodCard from '../../components/FoodCard';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button';
import { FoodItem } from '../../types/food'; //Import FoodItem type
import useTheme from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]); // 🆕 Add proper type
  const dispatch = useAppDispatch();
  const { items: defaultFoods, loading } = useAppSelector(state => state.foods);
  const router = useRouter();
  const {theme} = useTheme();

  // Fetch default foods on first render
  useEffect(() => {
    const defaultFoods = ['apple', 'banana', 'chicken breast', 'pasta', 'yogurt', 'bread', 'cheese', 'orange'];
    defaultFoods.forEach(food => dispatch(fetchFoods(food)));
  }, []);

  // Determine which foods to display
  const displayFoods = isSearching ? searchResults : defaultFoods;

  const handleSearch = async () => {
    if (query.trim()) {
      setIsSearching(true);
      
      // First, check if we have local results
      const localResults = defaultFoods.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      
      if (localResults.length > 0) {
        // Show local results immediately
        setSearchResults(localResults);
      }
      
      // Always search API for more results
      try {
        const result = await dispatch(fetchFoods(query)).unwrap();
        if (result && result.length > 0) {
          // Combine local and API results, remove duplicates
          const combinedResults = [...localResults, ...result].filter((item, index, array) => 
            index === array.findIndex(i => i.name === item.name)
          );
          setSearchResults(combinedResults);
        } else if (localResults.length === 0) {
          // No results from API or local
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search failed:', error);
        // If API fails, at least show local results
        if (localResults.length > 0) {
          setSearchResults(localResults);
        } else {
          setSearchResults([]);
        }
      }
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  // Real-time search as user types (optional)
  const handleQueryChange = (text: string) => { // 🆕 Add type annotation
    setQuery(text);
    if (!text.trim()) {
      handleClearSearch();
    }
  };

  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <Text style={[s.title, { color: theme.text }]}>NutriGuide+</Text>
      
      {/* Search Container */}
      {/* <View style={[s.searchContainer, { backgroundColor: theme.surface }]}>
        <TextInput
          style={[s.searchInput, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.inputBorder,
            color: theme.inputText 
          }]}
          placeholder="Search for food..."
          placeholderTextColor={theme.inputPlaceholder}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <View style={s.searchButtons}>
          {query ? (
            <Button 
              title="Clear" 
              onPress={handleClearSearch} 
              variant="secondary"
              style={s.clearButton}
            />
          ) : null}
          <Button 
            title="Search" 
            onPress={handleSearch} 
            style={s.searchButton}
            disabled={!query.trim()}
          />
        </View>
      </View> */}
            <View style={[s.searchContainer, { backgroundColor: theme.surface }]}>
        {/* Search Icon */}
        <Feather 
          name="search" 
          size={20} 
          color={theme.textSecondary} 
          style={s.searchIcon}
        />
        
        <TextInput
          style={[s.searchInput, { 
            backgroundColor: theme.inputBackground, 
            borderColor: theme.inputBorder,
            color: theme.inputText 
          }]}
          placeholder="Search for food..."
          placeholderTextColor={theme.inputPlaceholder}
          value={query}
          onChangeText={handleQueryChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        
        {/* Clear Button (X icon) - appears only when there's text */}
        {query ? (
          <TouchableOpacity 
            style={s.clearIconButton}
            onPress={handleClearSearch}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
        
        {/* Enhanced Search Button */}
        <TouchableOpacity 
          style={[
            s.searchIconButton,
            { 
              backgroundColor: query.trim() ? theme.primary : theme.border,
              opacity: query.trim() ? 1 : 0.6
            }
          ]}
          onPress={handleSearch}
          disabled={!query.trim()}
        >
          <Feather 
            name="search" 
            size={18} 
            color={query.trim() ? theme.textInverse : theme.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Search Status */}
      {isSearching && (
        <Text style={[s.searchStatus, { color: theme.textSecondary }]}>
          {loading 
            ? `Searching for "${query}"...` 
            : `Found ${displayFoods.length} result${displayFoods.length !== 1 ? 's' : ''} for "${query}"`
          }
        </Text>
      )}

      <FlatList
        data={displayFoods}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <FoodCard 
            item={item} 
            onPress={() => router.push(`/product/${encodeURIComponent(item.name)}`)} 
          />
        )}
        refreshing={loading && isSearching}
        onRefresh={() => {
          if (isSearching) {
            handleSearch(); // Refresh search
          } else {
            // Refresh default foods
            const defaultFoods = ['apple', 'banana', 'chicken breast', 'pasta', 'yogurt', 'bread', 'cheese', 'orange'];
            defaultFoods.forEach(food => dispatch(fetchFoods(food)));
          }
        }}
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyText}>
              {loading && isSearching 
                ? `Searching for "${query}"...` 
                : isSearching 
                  ? `No results found for "${query}"`
                  : 'Loading foods...'
              }
            </Text>
            {isSearching && !loading && (
              <Button 
                title="Show All Foods" 
                onPress={handleClearSearch}
                variant="secondary"
              />
            )}
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center',
    // color: '#1A1A1A',
  },
  searchContainer: { 
    flexDirection: 'row', 
    marginBottom: 16,
    alignItems: 'center',
  },
searchIcon: {
    marginRight: 8,
  },
  searchInput: { 
    flex: 1,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  clearIconButton: {
    padding: 6,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  searchIconButton: {
    padding: 10,
    borderRadius: 10,
    marginLeft: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
  },
  searchButton: {
    paddingHorizontal: 16,
  },
  searchStatus: {
    fontSize: 14,
    //color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: { 
    textAlign: 'center', 
    //color: '#666', 
    marginBottom: 16,
    fontSize: 16,
  },
});
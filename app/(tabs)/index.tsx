import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../lib/redux/hooks';
import { fetchFoods } from '../../lib/redux/slices/foodSlice';
import FoodCard from '../../components/FoodCard';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button';

export default function Home() {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const { items: foods, loading } = useAppSelector(state => state.foods);
  const router = useRouter();

  // Fetch default foods (e.g., popular items) on first render
  useEffect(() => {
    // hooks/useNutrition.ts
    const defaultFoods = ['apple', 'banana', 'chicken breast', 'pasta', 'yogurt', 'bread', 'cheese', 'orange'];
    defaultFoods.forEach(food => dispatch(fetchFoods(food)));
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(fetchFoods(query));
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>NutriGuide+</Text>
      <View style={s.searchContainer}>
        <TextInput
          style={s.searchInput}
          placeholder="Search for food..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>

      <FlatList
        data={foods}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <FoodCard 
            item={item} 
            onPress={() => router.push(`/product/${encodeURIComponent(item.name)}`)} 
          />
        )}
        refreshing={loading}
        onRefresh={handleSearch}
        ListEmptyComponent={
          <Text style={s.emptyText}>
            {loading ? 'Loading...' : 'No foods found'}
          </Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', marginBottom: 16 },
  searchInput: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 10, 
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
});

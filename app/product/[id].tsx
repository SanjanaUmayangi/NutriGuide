import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { fetchNutrition } from '../../lib/api/nutritionApi';
import { FoodItem } from '../../types/food';
import { addFavourite } from '../../lib/redux/slices/favouriteSlice';
import { addToTracker } from '../../lib/redux/slices/calorieSlice';
import Button from '../../components/ui/Button';

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const name = decodeURIComponent(id as string);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    loadFoodData();
  }, [name]);

  const loadFoodData = async () => {
    setLoading(true);
    try {
      const data = await fetchNutrition(name);
      if (data && data.length > 0) {
        setFood(data[0]);
      }
    } catch (error) {
      console.error('Failed to load food data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavourite = () => {
    if (food) {
      dispatch(addFavourite(food));
    }
  };

  const handleAddToTracker = () => {
    if (food) {
      dispatch(addToTracker(food));
    }
  };

  if (loading) {
    return (
      <View style={s.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={s.center}>
        <Text>Food not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.foodName}>{food.name}</Text>
      
<Image
  source={ food?.image ? { uri: food.image } : require('../../assets/images/icon.png') }
  style={s.image}
/>

      <View style={s.nutritionCard}>
        <Text style={s.sectionTitle}>Nutrition Facts</Text>
        <View style={s.nutritionRow}>
          <Text>Calories</Text>
          <Text style={s.nutritionValue}>{food.calories} kcal</Text>
        </View>
        <View style={s.nutritionRow}>
          <Text>Protein</Text>
          <Text style={s.nutritionValue}>{food.protein}g</Text>
        </View>
        <View style={s.nutritionRow}>
          <Text>Carbohydrates</Text>
          <Text style={s.nutritionValue}>{food.carbohydrates}g</Text>
        </View>
        <View style={s.nutritionRow}>
          <Text>Fat</Text>
          <Text style={s.nutritionValue}>{food.fat}g</Text>
        </View>
      </View>

      <View style={s.actions}>
        <Button title="Add to Favourites" onPress={handleAddFavourite} />
        <Button title="Add to Tracker" onPress={handleAddToTracker} variant="secondary" />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  foodName: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16 },
  nutritionCard: { 
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
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  nutritionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  nutritionValue: { fontWeight: '600' },
  actions: { gap: 12 },
});
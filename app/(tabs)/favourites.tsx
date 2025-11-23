import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavourite } from '../../lib/redux/slices/favouriteSlice';
import FoodCard from '../../components/FoodCard';
import { useRouter } from 'expo-router';
import Button from '../../components/ui/Button';

export default function Favourites() {
  const favourites = useSelector((state: any) => state.favourites.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemoveFavourite = (item: any) => {
    dispatch(removeFavourite(item.name));
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>My Favourites</Text>
      
      <FlatList
        data={favourites}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <View style={s.cardContainer}>
            <FoodCard 
              item={item} 
              onPress={() => router.push(`/product/${encodeURIComponent(item.name)}`)} 
            />
            <Button 
              title="Remove" 
              onPress={() => handleRemoveFavourite(item)} 
              variant="secondary"
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={s.emptyText}>No favourites yet. Add some from the home screen!</Text>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  cardContainer: { marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
});
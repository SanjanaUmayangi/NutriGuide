import FoodCard from '@/components/FoodCard';
import { removeFavourite } from '@/redux/slices/favouriteSlice';
import { RootState } from '@/redux/store';
import React from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function FavouritesScreen() {
  const items = useSelector((s: RootState) => s.favourites.items);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Favourites</Text>
      {items.length === 0 ? (
        <View style={styles.empty}><Text>No favourites yet.</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <View>
              <FoodCard id={item.id} title={item.title} description={item.description} image={item.image} />
              <Button title="Remove" onPress={() => dispatch(removeFavourite(item.id))} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

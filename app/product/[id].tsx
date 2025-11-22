import { fetchProductById } from '@/api/dummyApi';
import { addFavourite } from '@/redux/slices/favouriteSlice';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

export default function ProductDetails() {
  const params = useLocalSearchParams();
  const id = Number(params.id);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!product)
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: product.title }} />
      <ScrollView contentContainerStyle={styles.container}>
        {product.thumbnail ? (
          <Image source={{ uri: product.thumbnail }} style={styles.image} />
        ) : null}
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{product.price} USD</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.metaRow}>
          <Text>Rating: {product.rating}</Text>
          <Text>Stock: {product.stock}</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Button
            title="Add to Favourites"
            onPress={() =>
              dispatch(
                addFavourite({ id: product.id, title: product.title, description: product.description, image: product.thumbnail }),
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  price: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  desc: { marginTop: 12, color: '#444' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});

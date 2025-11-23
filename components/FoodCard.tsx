import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FoodItem } from '../types/food';

interface FoodCardProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
}

// components/FoodCard.tsx
export default function FoodCard({ item, onPress }: FoodCardProps) {
  return (
    <TouchableOpacity style={s.card} onPress={() => onPress(item)}>
      <Image
        source={ 
          item.image 
            ? { uri: item.image } 
            : require('../assets/images/icon.png') 
        }
        style={s.image}
        defaultSource={require('../assets/images/icon.png')}
      />
      <View style={s.info}>
        <Text style={s.name}>{item.name}</Text>
        <Text style={s.calories}>
          {item.calories > 0 ? `${item.calories} kcal` : 'Calories unknown'}
        </Text>
        <View style={s.macros}>
          <Text style={s.macro}>P: {item.protein > 0 ? `${item.protein}g` : '?'}</Text>
          <Text style={s.macro}>C: {item.carbohydrates > 0 ? `${item.carbohydrates}g` : '?'}</Text>
          <Text style={s.macro}>F: {item.fat > 0 ? `${item.fat}g` : '?'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
  },
  macro: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
});
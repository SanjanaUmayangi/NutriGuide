import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FoodItem } from '../types/food';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { addFavourite, removeFavourite } from '../lib/redux/slices/favouriteSlice';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FoodCardProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
  showFavouriteButton?: boolean;
}

// components/FoodCard.tsx
export default function FoodCard({ item, onPress }: FoodCardProps) {
    const dispatch = useAppDispatch();
  const favourites = useAppSelector(state => state.favourites.items);
  
  // Check if current item is in favourites
  const isFavourite = favourites.some(fav => fav.name === item.name);

  const handleFavouritePress = () => {
    if (isFavourite) {
      dispatch(removeFavourite(item.name));
    } else {
      dispatch(addFavourite(item));
    }
  };

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

{/* Favourite Heart Icon */}
      <TouchableOpacity 
        style={[s.heartButton, isFavourite && s.heartButtonActive]}
        onPress={handleFavouritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon 
          name={isFavourite ? "heart" : "heart-o"} 
          size={16} 
          color={isFavourite ? "#ff4444" : "#999"} 
        />
      </TouchableOpacity>

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
    position: 'relative', 
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 30,
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
  // Heart button styles
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  heartButtonActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  heartIcon: {
    fontSize: 16,
  },
  heartIconActive: {
    fontSize: 16,
  },
});
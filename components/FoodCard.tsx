import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FoodItem } from '../types/food';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { addFavourite, removeFavourite } from '../lib/redux/slices/favouriteSlice';
import Icon from 'react-native-vector-icons/FontAwesome';
import useTheme from '../hooks/useTheme'; // 🆕 Import theme hook

interface FoodCardProps {
  item: FoodItem;
  onPress: (item: FoodItem) => void;
  showFavouriteButton?: boolean;
}

export default function FoodCard({ item, onPress }: FoodCardProps) {
  const dispatch = useAppDispatch();
  const favourites = useAppSelector(state => state.favourites.items);
  const { theme } = useTheme(); // 🆕 Get theme
  
  const isFavourite = favourites.some(fav => fav.name === item.name);

  const handleFavouritePress = () => {
    if (isFavourite) {
      dispatch(removeFavourite(item.name));
    } else {
      dispatch(addFavourite(item));
    }
  };

  return (
    <TouchableOpacity 
      style={[s.card, { backgroundColor: theme.surface }]} 
      onPress={() => onPress(item)}
    >
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
        <Text style={[s.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[s.calories, { color: theme.textSecondary }]}>
          {item.calories > 0 ? `${item.calories} kcal` : 'Calories unknown'}
        </Text>
        <View style={s.macros}>
          <Text style={[s.macro, { color: theme.textSecondary }]}>
            P: {item.protein > 0 ? `${item.protein}g` : '?'}
          </Text>
          <Text style={[s.macro, { color: theme.textSecondary }]}>
            C: {item.carbohydrates > 0 ? `${item.carbohydrates}g` : '?'}
          </Text>
          <Text style={[s.macro, { color: theme.textSecondary }]}>
            F: {item.fat > 0 ? `${item.fat}g` : '?'}
          </Text>
        </View>
      </View>

      {/* Favourite Heart Icon */}
      <TouchableOpacity 
        style={[
          s.heartButton, 
          { backgroundColor: theme.background + 'CC' },
          isFavourite && [s.heartButtonActive, { backgroundColor: theme.error + '20' }]
        ]}
        onPress={handleFavouritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon 
          name={isFavourite ? "heart" : "heart-o"} 
          size={16} 
          color={isFavourite ? theme.error : theme.textSecondary} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
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
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
  },
  macro: {
    fontSize: 12,
    marginRight: 8,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  heartButtonActive: {
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
});
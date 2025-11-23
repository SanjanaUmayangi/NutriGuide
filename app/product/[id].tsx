import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'; // 🆕 ADD useRouter
import { useDispatch, useSelector } from 'react-redux';
import { fetchNutrition } from '../../lib/api/nutritionApi';
import { FoodItem } from '../../types/food';
import { addFavourite, removeFavourite } from '../../lib/redux/slices/favouriteSlice';
import { addToTracker } from '../../lib/redux/slices/calorieSlice';
import { Feather } from '@expo/vector-icons';

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const name = decodeURIComponent(id as string);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favouriteAdded, setFavouriteAdded] = useState(false);
  const [trackerAdded, setTrackerAdded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter(); // 🆕 ADD ROUTER
  const navigation = useNavigation();
  const favourites = useSelector((state: any) => state.favourites.items);
  const isFavourite = favourites.some((fav: FoodItem) => fav.name === food?.name);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  const loadFoodData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNutrition(name);
      if (data && data.length > 0) {
        setFood(data[0]);
        // Start animations when data is loaded
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } catch (error) {
      console.error('Failed to load food data:', error);
    } finally {
      setLoading(false);
    }
  }, [name, fadeAnim, slideAnim]);

  useEffect(() => {
    loadFoodData();
  }, [loadFoodData]);

  const handleAddFavourite = () => {
    if (food) {
      if (isFavourite) {
        dispatch(removeFavourite(food.name));
        setFavouriteAdded(false);
      } else {
        dispatch(addFavourite(food));
        setFavouriteAdded(true);
        setTimeout(() => setFavouriteAdded(false), 2000);
      }
    }
  };

  const handleAddToTracker = () => {
    if (food) {
      dispatch(addToTracker(food));
      setTrackerAdded(true);
      setTimeout(() => setTrackerAdded(false), 2000);
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)'); // Fallback to home
    }
  };

  const NutritionRow = ({ label, value, unit = '' }: { label: string; value: any; unit?: string }) => (
    <View style={s.nutritionRow}>
      <Text style={s.nutritionLabel}>{label}</Text>
      <Text style={s.nutritionValue}>
        {value || value === 0 ? `${value}${unit}` : 'N/A'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={s.center}>
        <View style={s.loadingContainer}>
          <Feather name="loader" size={32} color="#4CAF50" style={s.loadingIcon} />
          <Text style={s.loadingText}>Loading nutrition data...</Text>
        </View>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={s.center}>
        <View style={s.errorContainer}>
          <Feather name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={s.errorTitle}>Food Not Found</Text>
          <Text style={s.errorText}>
            Sorry, we can&apos;t find nutrition data for &quot;{name}&quot;
          </Text>
          {/* 🆕 ADD BACK BUTTON TO ERROR STATE */}
          <TouchableOpacity style={s.backButton} onPress={handleGoBack}>
            <Feather name="arrow-left" size={20} color="#4CAF50" />
            <Text style={s.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={s.screenContainer}>
      {/* 🆕 BACK BUTTON - FLOATING */}
      <TouchableOpacity 
        style={s.backButton}
        onPress={handleGoBack}
      >
        <Feather name="arrow-left" size={24} color="#2D3748" />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            s.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={s.foodName}>{food.name}</Text>
          
          <View style={s.imageContainer}>
            <Image
              source={ food?.image ? { uri: food.image } : require('../../assets/images/icon.png') }
              style={s.image}
            />
            <View style={s.imageOverlay} />
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View 
          style={[
            s.statsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={s.statItem}>
            <Text style={s.statValue}>{food.calories}</Text>
            <Text style={s.statLabel}>Calories</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>{food.protein}g</Text>
            <Text style={s.statLabel}>Protein</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>{food.carbohydrates}g</Text>
            <Text style={s.statLabel}>Carbs</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statValue}>{food.fat}g</Text>
            <Text style={s.statLabel}>Fat</Text>
          </View>
        </Animated.View>

        {/* Nutrition Card */}
        <Animated.View 
          style={[
            s.nutritionCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={s.sectionHeader}>
            <Feather name="bar-chart-2" size={20} color="#4CAF50" />
            <Text style={s.sectionTitle}>Nutrition Facts</Text>
          </View>

          <View style={s.singleColumn}>
            <NutritionRow label="Calories" value={food.calories} unit=" kcal" />
            <NutritionRow label="Protein" value={food.protein} unit="g" />
            <NutritionRow label="Carbohydrates" value={food.carbohydrates} unit="g" />
            <NutritionRow label="Total Fat" value={food.fat} unit="g" />
            <NutritionRow label="Saturated Fat" value={food.fat_saturated} unit="g" />
            <NutritionRow label="Serving Size" value={food.serving_size_g} unit="g" />
            <NutritionRow label="Sodium" value={food.sodium_mg} unit="mg" />
            <NutritionRow label="Potassium" value={food.potassium_mg} unit="mg" />
            <NutritionRow label="Cholesterol" value={food.cholesterol_mg} unit="mg" />
            <NutritionRow label="Fiber" value={food.fiber} unit="g" />
            <NutritionRow label="Sugar" value={food.sugar} unit="g" />
          </View>
        </Animated.View>

        {/* Status Messages */}
        {favouriteAdded && (
          <Animated.View 
            style={[s.statusMessage, s.successMessage]}
          >
            <Feather name="check-circle" size={18} color="#38A169" />
            <Text style={s.statusText}>Added to Favorites!</Text>
          </Animated.View>
        )}
        
        {trackerAdded && (
          <Animated.View 
            style={[s.statusMessage, s.successMessage]}
          >
            <Feather name="check-circle" size={18} color="#38A169" />
            <Text style={s.statusText}>Added to Daily Tracker!</Text>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View 
          style={[
            s.actions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Favourite Button */}
          <TouchableOpacity 
            style={[
              s.iconButton,
              isFavourite ? s.favouriteButtonActive : s.favouriteButton
            ]}
            onPress={handleAddFavourite}
          >
            <Feather 
              name="heart" 
              size={22} 
              color={isFavourite ? "#FFFFFF" : "#FF6B6B"} 
              fill={isFavourite ? "#FFFFFF" : "none"}
            />
            <Text style={[
              s.iconButtonText,
              isFavourite && s.iconButtonTextActive
            ]}>
              {isFavourite ? 'Favourited' : 'Add to Favourites'}
            </Text>
          </TouchableOpacity>

          {/* Tracker Button */}
          <TouchableOpacity 
            style={[
              s.iconButton,
              trackerAdded ? s.trackerButtonActive : s.trackerButton
            ]}
            onPress={handleAddToTracker}
            disabled={trackerAdded}
          >
            <Feather 
              name={trackerAdded ? "check-circle" : "plus-circle"} 
              size={22} 
              color={trackerAdded ? "#FFFFFF" : "#4CAF50"} 
            />
            <Text style={[
              s.iconButtonText,
              trackerAdded && s.iconButtonTextActive
            ]}>
              {trackerAdded ? 'Added to Tracker' : 'Add to Tracker'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: { 
    padding: 20,
    paddingTop: 70, // 🆕 ADD PADDING FOR BACK BUTTON
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  // 🆕 BACK BUTTON STYLES
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  backButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  foodName: { 
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 20, 
    textAlign: 'center',
    color: '#1A1A1A',
    lineHeight: 34,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  image: { 
    width: '100%', 
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  nutritionCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 24, 
    borderRadius: 16, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginLeft: 8,
    color: '#1A1A1A',
  },
  singleColumn: {
    // Single column layout
  },
  nutritionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
    flex: 1,
  },
  nutritionValue: { 
    fontWeight: '700',
    color: '#2D3748',
    fontSize: 14,
  },
  actions: { 
    gap: 12,
    marginBottom: 20,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  successMessage: {
    backgroundColor: '#F0FFF4',
    borderColor: '#9AE6B4',
  },
  statusText: {
    color: '#276749',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  // Modern Icon Buttons Styles
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favouriteButton: {
    backgroundColor: 'transparent',
    borderColor: '#FF6B6B',
  },
  favouriteButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  trackerButton: {
    backgroundColor: 'transparent',
    borderColor: '#4CAF50',
  },
  trackerButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  iconButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    color: '#2D3748',
  },
  iconButtonTextActive: {
    color: '#FFFFFF',
  },
});
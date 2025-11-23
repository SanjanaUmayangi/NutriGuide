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
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNutrition } from '../../lib/api/nutritionApi';
import { FoodItem } from '../../types/food';
import { addFavourite, removeFavourite } from '../../lib/redux/slices/favouriteSlice';
import { addToTracker } from '../../lib/redux/slices/calorieSlice';
import { Feather } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const name = decodeURIComponent(id as string);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [favouriteAdded, setFavouriteAdded] = useState(false);
  const [trackerAdded, setTrackerAdded] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const favourites = useSelector((state: any) => state.favourites.items);
  const isFavourite = favourites.some((fav: FoodItem) => fav.name === food?.name);
  const { theme } = useTheme(); // 🆕 Get theme

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
      router.push('/(tabs)');
    }
  };

  const NutritionRow = ({ label, value, unit = '' }: { label: string; value: any; unit?: string }) => (
    <View style={s.nutritionRow}>
      <Text style={[s.nutritionLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[s.nutritionValue, { color: theme.text }]}>
        {value || value === 0 ? `${value}${unit}` : 'N/A'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[s.center, { backgroundColor: theme.background }]}>
        <View style={s.loadingContainer}>
          <Feather name="loader" size={32} color={theme.primary} style={s.loadingIcon} />
          <Text style={[s.loadingText, { color: theme.text }]}>Loading nutrition data...</Text>
        </View>
      </View>
    );
  }

  if (!food) {
    return (
      <View style={[s.center, { backgroundColor: theme.background }]}>
        <View style={s.errorContainer}>
          <Feather name="alert-circle" size={48} color={theme.error} />
          <Text style={[s.errorTitle, { color: theme.text }]}>Food Not Found</Text>
          <Text style={[s.errorText, { color: theme.textSecondary }]}>
            Sorry, we can&apos;t find nutrition data for &quot;{name}&quot;
          </Text>
          <TouchableOpacity style={[s.backButton, { backgroundColor: theme.surface }]} onPress={handleGoBack}>
            <Feather name="arrow-left" size={20} color={theme.primary} />
            <Text style={[s.backButtonText, { color: theme.primary }]}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.screenContainer, { backgroundColor: theme.background }]}>
      {/* BACK BUTTON - FLOATING */}
      <TouchableOpacity 
        style={[s.backButton, { backgroundColor: theme.surface }]}
        onPress={handleGoBack}
      >
        <Feather name="arrow-left" size={24} color={theme.text} />
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
          <Text style={[s.foodName, { color: theme.text }]}>{food.name}</Text>
          
          <View style={s.imageContainer}>
            <Image
              source={ food?.image ? { uri: food.image } : require('../../assets/images/icon.png') }
              style={s.image}
            />
            <View style={[s.imageOverlay, { backgroundColor: 'rgba(0,0,0,0.03)' }]} />
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View 
          style={[
            s.statsCard,
            { backgroundColor: theme.surface },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: theme.primary }]}>{food.calories}</Text>
            <Text style={[s.statLabel, { color: theme.textSecondary }]}>Calories</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: theme.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: theme.primary }]}>{food.protein}g</Text>
            <Text style={[s.statLabel, { color: theme.textSecondary }]}>Protein</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: theme.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: theme.primary }]}>{food.carbohydrates}g</Text>
            <Text style={[s.statLabel, { color: theme.textSecondary }]}>Carbs</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: theme.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: theme.primary }]}>{food.fat}g</Text>
            <Text style={[s.statLabel, { color: theme.textSecondary }]}>Fat</Text>
          </View>
        </Animated.View>

        {/* Nutrition Card */}
        <Animated.View 
          style={[
            s.nutritionCard,
            { backgroundColor: theme.surface },
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={s.sectionHeader}>
            <Feather name="bar-chart-2" size={20} color={theme.primary} />
            <Text style={[s.sectionTitle, { color: theme.text }]}>Nutrition Facts</Text>
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
            style={[s.statusMessage, s.successMessage, { backgroundColor: theme.success + '20', borderColor: theme.success + '40' }]}
          >
            <Feather name="check-circle" size={18} color={theme.success} />
            <Text style={[s.statusText, { color: theme.success }]}>Added to Favorites!</Text>
          </Animated.View>
        )}
        
        {trackerAdded && (
          <Animated.View 
            style={[s.statusMessage, s.successMessage, { backgroundColor: theme.success + '20', borderColor: theme.success + '40' }]}
          >
            <Feather name="check-circle" size={18} color={theme.success} />
            <Text style={[s.statusText, { color: theme.success }]}>Added to Daily Tracker!</Text>
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
              isFavourite 
                ? [s.favouriteButtonActive, { backgroundColor: theme.error, borderColor: theme.error }]
                : [s.favouriteButton, { borderColor: theme.error }]
            ]}
            onPress={handleAddFavourite}
          >
            <Feather 
              name="heart" 
              size={22} 
              color={isFavourite ? theme.textInverse : theme.error} 
              fill={isFavourite ? theme.textInverse : "none"}
            />
            <Text style={[
              s.iconButtonText,
              isFavourite 
                ? [s.iconButtonTextActive, { color: theme.textInverse }]
                : { color: theme.error }
            ]}>
              {isFavourite ? 'Favourited' : 'Add to Favourites'}
            </Text>
          </TouchableOpacity>

          {/* Tracker Button */}
          <TouchableOpacity 
            style={[
              s.iconButton,
              trackerAdded 
                ? [s.trackerButtonActive, { backgroundColor: theme.primary, borderColor: theme.primary }]
                : [s.trackerButton, { borderColor: theme.primary }]
            ]}
            onPress={handleAddToTracker}
            disabled={trackerAdded}
          >
            <Feather 
              name={trackerAdded ? "check-circle" : "plus-circle"} 
              size={22} 
              color={trackerAdded ? theme.textInverse : theme.primary} 
            />
            <Text style={[
              s.iconButtonText,
              trackerAdded 
                ? [s.iconButtonTextActive, { color: theme.textInverse }]
                : { color: theme.primary }
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
  },
  container: { 
    padding: 20,
    paddingTop: 70,
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  backButtonText: {
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
    fontWeight: '500',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
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
  },
  statsCard: {
    flexDirection: 'row',
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  nutritionCard: { 
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
  },
  nutritionLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  nutritionValue: { 
    fontWeight: '700',
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
    // Styles handled inline
  },
  statusText: {
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
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
  },
  favouriteButtonActive: {
    // Styles handled inline
  },
  trackerButton: {
    backgroundColor: 'transparent',
  },
  trackerButtonActive: {
    // Styles handled inline
  },
  iconButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  iconButtonTextActive: {
    // Styles handled inline
  },
});
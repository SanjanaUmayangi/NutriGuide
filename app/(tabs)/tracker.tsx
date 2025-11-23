// import React from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { clearTracker, removeFromTracker } from '../../lib/redux/slices/calorieSlice';
// import Button from '../../components/ui/Button';

// export default function Tracker() {
//   const trackerItems = useSelector((state: any) => state.calories.items);
//   const dispatch = useDispatch();

//   const totalCalories = trackerItems.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);

//   const handleRemoveItem = (index: number) => {
//     dispatch(removeFromTracker(index));
//   };

//   const handleClearTracker = () => {
//     dispatch(clearTracker());
//   };

//   return (
//     <View style={s.container}>
//       <Text style={s.title}>Calorie Tracker</Text>
      
//       <View style={s.summaryCard}>
//         <Text style={s.totalCalories}>Total Calories: {totalCalories} kcal</Text>
//         <Text style={s.goalText}>Daily Goal: 2000 kcal</Text>
//         <View style={s.progressBar}>
//           <View 
//             style={[
//               s.progressFill, 
//               { width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }
//             ]} 
//           />
//         </View>
//       </View>

//       <FlatList
//         data={trackerItems}
//         keyExtractor={(item, index) => `${item.name}-${index}`}
//         renderItem={({ item, index }) => (
//           <View style={s.trackerItem}>
//             <View style={s.itemInfo}>
//               <Text style={s.itemName}>{item.name}</Text>
//               <Text style={s.itemCalories}>{item.calories} kcal</Text>
//             </View>
//             <Button 
//               title="Remove" 
//               onPress={() => handleRemoveItem(index)} 
//               variant="secondary"
//             />
//           </View>
//         )}
//         ListEmptyComponent={
//           <Text style={s.emptyText}>No items tracked today. Add some from food details!</Text>
//         }
//       />

//       {trackerItems.length > 0 && (
//         <Button title="Clear All" onPress={handleClearTracker} />
//       )}
//     </View>
//   );
// }

// const s = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
//   summaryCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   totalCalories: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
//   goalText: { fontSize: 14, color: '#666', marginBottom: 12 },
//   progressBar: {
//     height: 8,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#4CAF50',
//   },
//   trackerItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   itemInfo: { flex: 1 },
//   itemName: { fontWeight: '600' },
//   itemCalories: { color: '#666', fontSize: 12 },
//   emptyText: { textAlign: 'center', color: '#666', marginTop: 20 },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import {
  removeFromTracker,
  updateQuantity,
  clearTracker,
  setDailyGoal,
} from '../../lib/redux/slices/calorieSlice';
import { Feather } from '@expo/vector-icons';
import Button from '../../components/ui/Button';

export default function Tracker() {
  const dispatch = useAppDispatch();
  const { items: trackerItems, dailyGoal } = useAppSelector(state => state.calories);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal.toString());

  // Filter today's items only
  const today = new Date().toDateString();
  const todayItems = trackerItems.filter(item => item.dateAdded === today);

  // Calculate totals
  const totalCalories = todayItems.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = todayItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = todayItems.reduce((sum, item) => sum + (item.carbohydrates || 0), 0);
  const totalFat = todayItems.reduce((sum, item) => sum + (item.fat || 0), 0);

  const caloriesRemaining = dailyGoal - totalCalories;
  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  const handleRemoveItem = (index: number) => {
    dispatch(removeFromTracker(index));
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
    } else {
      dispatch(updateQuantity({ index, quantity: newQuantity }));
    }
  };

  const handleClearTracker = () => {
    Alert.alert(
      'Clear Today\'s Tracker',
      'Are you sure you want to remove all items from today\'s tracker?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearTracker()),
        },
      ]
    );
  };

  const handleSaveGoal = () => {
    const goal = parseInt(newGoal);
    if (goal > 0) {
      dispatch(setDailyGoal(goal));
      setEditingGoal(false);
    }
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return '#FF6B6B';
    if (progressPercentage >= 85) return '#FFA726';
    return '#4CAF50';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>

      {/* Daily Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <TouchableOpacity onPress={() => setEditingGoal(!editingGoal)}>
            <Feather name="edit-2" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        {editingGoal ? (
          <View style={styles.goalEdit}>
            <TextInput
              style={styles.goalInput}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              placeholder="Daily goal"
            />
            <TouchableOpacity onPress={handleSaveGoal} style={styles.saveButton}>
              <Feather name="check" size={16} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditingGoal(false);
                setNewGoal(dailyGoal.toString());
              }}
              style={styles.cancelButton}
            >
              <Feather name="x" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.goalText}>Daily Goal: {dailyGoal} kcal</Text>
        )}

        <Text style={styles.caloriesText}>
          {totalCalories} / {dailyGoal} kcal
        </Text>
        <Text
          style={[
            styles.remainingText,
            { color: caloriesRemaining < 0 ? '#FF6B6B' : '#666' },
          ]}>
          {caloriesRemaining >= 0
            ? `${caloriesRemaining} kcal remaining`
            : `${Math.abs(caloriesRemaining)} kcal over`}
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>

        {/* Macronutrients */}
        <View style={styles.macrosSummary}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{totalProtein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{totalCarbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{totalFat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>

      {/* Tracked Items List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Tracked Foods ({todayItems.length})</Text>
        {todayItems.length > 0 && (
          <Button title="Clear All" onPress={handleClearTracker} variant="secondary" />
        )}
      </View>

      <FlatList
        data={todayItems}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.trackerItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                {item.calories} kcal • P: {item.protein}g • C: {item.carbohydrates}g • F: {item.fat}g
              </Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(index, item.quantity - 1)}
                style={styles.quantityButton}
              >
                <Feather name="minus" size={16} color="#666" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => handleUpdateQuantity(index, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <Feather name="plus" size={16} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveItem(index)}
                style={styles.deleteButton}
              >
                <Feather name="trash-2" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="activity" size={48} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No Foods Tracked Today</Text>
            <Text style={styles.emptyText}>
              Add foods from the home screen to track your daily calories and macros.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1E1E1E',
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  goalEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
  goalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  caloriesText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  remainingText: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macrosSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  trackerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  quantityText: {
    fontWeight: '600',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    lineHeight: 20,
  },
});
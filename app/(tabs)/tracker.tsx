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
import useTheme from '../../hooks/useTheme'; // 🆕 Import theme hook

export default function Tracker() {
  const dispatch = useAppDispatch();
  const { items: trackerItems, dailyGoal } = useAppSelector(state => state.calories);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(dailyGoal.toString());
  const { theme } = useTheme(); // 🆕 Get theme

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
    if (progressPercentage >= 100) return theme.error;
    if (progressPercentage >= 85) return theme.warning;
    return theme.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Calorie Tracker</Text>

      {/* Daily Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: theme.surface }]}>
        <View style={styles.summaryHeader}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>Summary</Text>
          <TouchableOpacity onPress={() => setEditingGoal(!editingGoal)}>
            <Feather name="edit-2" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {editingGoal ? (
          <View style={styles.goalEdit}>
            <TextInput
              style={[styles.goalInput, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.inputText
              }]}
              value={newGoal}
              onChangeText={setNewGoal}
              keyboardType="numeric"
              placeholder="Daily goal"
              placeholderTextColor={theme.inputPlaceholder}
            />
            <TouchableOpacity onPress={handleSaveGoal} style={styles.saveButton}>
              <Feather name="check" size={16} color={theme.success} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditingGoal(false);
                setNewGoal(dailyGoal.toString());
              }}
              style={styles.cancelButton}
            >
              <Feather name="x" size={16} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.goalText, { color: theme.textSecondary }]}>
            Daily Goal: {dailyGoal} kcal
          </Text>
        )}

        <Text style={[styles.caloriesText, { color: theme.text }]}>
          {totalCalories} / {dailyGoal} kcal
        </Text>
        <Text
          style={[
            styles.remainingText,
            { color: caloriesRemaining < 0 ? theme.error : theme.textSecondary },
          ]}>
          {caloriesRemaining >= 0
            ? `${caloriesRemaining} kcal remaining`
            : `${Math.abs(caloriesRemaining)} kcal over`}
        </Text>

        {/* Progress Bar */}
        <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
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
            <Text style={[styles.macroValue, { color: theme.primary }]}>{totalProtein}g</Text>
            <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.primary }]}>{totalCarbs}g</Text>
            <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: theme.primary }]}>{totalFat}g</Text>
            <Text style={[styles.macroLabel, { color: theme.textSecondary }]}>Fat</Text>
          </View>
        </View>
      </View>

      {/* Tracked Items List */}
      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: theme.text }]}>
          Tracked Foods ({todayItems.length})
        </Text>
        {todayItems.length > 0 && (
        //   <Button title="Clear All" onPress={handleClearTracker} variant="secondary" />
        <TouchableOpacity 
            style={[styles.clearButton, { 
              backgroundColor: theme.error + '20', 
              borderColor: theme.error + '40' 
            }]}
            onPress={handleClearTracker}
          >
            <Feather name="trash-2" size={20} color={theme.error} />
            <Text style={[styles.clearButtonText, { color: theme.error }]}>Clear All</Text>
          </TouchableOpacity>
        )}


      </View>

      <FlatList
        data={todayItems}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item, index }) => (
          <View style={[styles.trackerItem, { backgroundColor: theme.surface }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemDetails, { color: theme.textSecondary }]}>
                {item.calories} kcal • P: {item.protein}g • C: {item.carbohydrates}g • F: {item.fat}g
              </Text>
            </View>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(index, item.quantity - 1)}
                style={[styles.quantityButton, { backgroundColor: theme.inputBackground }]}
              >
                <Feather name="minus" size={16} color={theme.textSecondary} />
              </TouchableOpacity>

              <Text style={[styles.quantityText, { color: theme.text }]}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => handleUpdateQuantity(index, item.quantity + 1)}
                style={[styles.quantityButton, { backgroundColor: theme.inputBackground }]}
              >
                <Feather name="plus" size={16} color={theme.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveItem(index)}
                style={styles.deleteButton}
              >
                <Feather name="trash-2" size={16} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="activity" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Foods Tracked Today</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryCard: {
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
  },
  macroLabel: {
    fontSize: 12,
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
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 6,
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
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearButtonText: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
});
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../lib/redux/hooks';
import { toggleBookmark } from '../lib/redux/slices/tipsSlice';
import { Tip } from '../types/api';

interface TipCardProps {
  tip: Tip;
  onPress?: (tip: Tip) => void;
  variant?: 'default' | 'featured';
}

export default function TipCard({ tip, onPress, variant = 'default' }: TipCardProps) {
  const dispatch = useAppDispatch();
  const bookmarkedTips = useAppSelector(state => state.tips.bookmarkedTips);
  
  const isBookmarked = bookmarkedTips.includes(tip.id);

  const handleBookmarkPress = async () => {
    try {
      await dispatch(toggleBookmark({
        tipId: tip.id,
        bookmarked: !isBookmarked
      })).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to bookmark tip');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${tip.title}\n\n${tip.content}\n\n— Shared from NutriGuide+`,
        title: tip.title,
      });
    } catch (error) {
      console.log('Share failed:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Nutrition': '#4CAF50',
      'Hydration': '#2196F3',
      'Fitness': '#FF9800',
      'Sleep': '#9C27B0',
      'Mindfulness': '#009688',
      'Mental Health': '#E91E63',
      'Digestive Health': '#795548',
    };
    return colors[category] || '#666';
  };

  const getDifficultyColor = (difficulty?: string) => {
    const colors: { [key: string]: string } = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336',
    };
    return colors[difficulty || 'beginner'] || '#666';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        variant === 'featured' && styles.featuredCard
      ]}
      onPress={() => onPress?.(tip)}
      activeOpacity={0.7}
    >
      {/* Category Badge */}
      <View style={styles.header}>
        <View 
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(tip.category) }
          ]}
        >
          <Text style={styles.categoryText}>{tip.category}</Text>
        </View>
        
        {tip.difficulty && (
          <View 
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(tip.difficulty) }
            ]}
          >
            <Text style={styles.difficultyText}>
              {tip.difficulty.charAt(0).toUpperCase() + tip.difficulty.slice(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {tip.title}
      </Text>

      {/* Description */}
      {tip.description && (
        <Text style={styles.description} numberOfLines={2}>
          {tip.description}
        </Text>
      )}

      {/* Content Preview */}
      <Text style={styles.content} numberOfLines={3}>
        {tip.content}
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          {tip.readTime && (
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color="#666" />
              <Text style={styles.metaText}>{tip.readTime} min read</Text>
            </View>
          )}
          
          {tip.source && (
            <View style={styles.metaItem}>
              <Feather name="book" size={12} color="#666" />
              <Text style={styles.metaText}>{tip.source}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            onPress={handleShare}
            style={styles.actionButton}
          >
            <Feather name="share-2" size={16} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleBookmarkPress}
            style={styles.actionButton}
          >
            <Feather 
              name="bookmark" 
              size={16} 
              color={isBookmarked ? "#4CAF50" : "#666"} 
              fill={isBookmarked ? "#4CAF50" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featuredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E1E1E',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  content: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
});
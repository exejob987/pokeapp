import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors } from '@theme/colors';
import { typography } from '@theme/typography';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  useEffect(() => {
    focusAnim.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused, focusAnim]);

  useEffect(() => {
    if (value === '' && localValue !== '') {
      setLocalValue('');
    }
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChangeText(localValue);
    }, debounceMs);
    return () => clearTimeout(handler);
  }, [localValue, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChangeText('');
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [colors.cardBorder, colors.primary]
      ),
      elevation: focusAnim.value ? 6 : 2,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.iconContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
      </View>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={setLocalValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {localValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton} activeOpacity={0.6}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    height: 52,
    paddingHorizontal: 4,
    boxShadow: '0px 4px 12px rgba(100, 116, 139, 0.06)',
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    height: '100%',
    paddingVertical: 0,
    paddingLeft: 4,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  clearIcon: {
    ...typography.label,
    color: colors.textSecondary,
  },
});

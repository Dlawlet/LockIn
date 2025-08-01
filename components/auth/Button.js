import { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/config';

export const Button = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style,
  disabled = false
}) => {
  const _style = useCallback(({ pressed }) => [
    style,
    { opacity: pressed ? activeOpacity : 1 }

  ]);

  if (borderless) {
    return (
      <Pressable onPress={onPress} style={_style} disabled={disabled}>
        <Text style={styles.borderlessButtonText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style} disabled={disabled}>
      {children}
    </Pressable>
  );
};

// ✅ This will prevent 'children is required' errors
Button.defaultProps = {
  children: null,
  title: "",
  style: {},
};

const styles = StyleSheet.create({
  borderlessButtonText: {
    fontSize: 16,
    color: Colors.blue
  }
});

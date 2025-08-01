import { Colors } from '@/config';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export const Button = ({
  children,
  onPress,
  activeOpacity = 0.3,
  borderless = false,
  title,
  style,
  disabled = false
}) => {
  const _style = useCallback(
    ({ pressed }) => [style, { opacity: pressed ? activeOpacity : 1 }],
    [style, activeOpacity]
  );

  if (borderless) {
    return (
      <Pressable key={title} onPress={onPress} style={_style} disabled={disabled}>
        <Text style={styles.borderlessButtonText}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={_style} disabled={disabled}>
      {children ?? <Text>{title}</Text>}
    </Pressable>
  );
};

Button.defaultProps = {
  children: null,
  title: '',
  style: {},
};

const styles = StyleSheet.create({
  borderlessButtonText: {
    fontSize: 16,
    color: Colors.blue,
  },
});

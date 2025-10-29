/**
 * 自定义按钮组件
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    margin: 7.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: COLORS.white,
  },
  primaryText: {
    color: COLORS.primary,
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  successText: {
    color: COLORS.white,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabled: {
    backgroundColor: COLORS.gray[400],
    opacity: 0.5,
  },
});

/**
 * 导航配置
 */

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FocusScreen } from '../screens/FocusScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray[400],
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.gray[200],
          },
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Focus"
          component={FocusScreen}
          options={{
            title: 'BuddhaFlow',
            tabBarLabel: '专注',
            tabBarIcon: ({ color }) => <TabIcon name="⏱️" color={color} />,
          }}
        />
        <Tab.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: '统计数据',
            tabBarLabel: '统计',
            tabBarIcon: ({ color }) => <TabIcon name="📊" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 简单的图标组件（使用 emoji）
function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ fontSize: 24 }}>{name}</Text>
  );
}

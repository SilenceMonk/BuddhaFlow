/**
 * 7天专注时间趋势图
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getLastNDays } from '../utils/timeCalculations';

const screenWidth = Dimensions.get('window').width;

export default function WeekChart({ sessions }) {
  // 准备数据
  const last7Days = getLastNDays(7);

  const dayData = last7Days.map((date) => {
    const total = sessions
      .filter((s) => s.date === date)
      .reduce((sum, s) => sum + s.focusDuration, 0);

    const dateObj = new Date(date);
    const label = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

    return {
      date,
      hours: total / 3600,
      label,
    };
  });

  const chartData = {
    labels: dayData.map((d) => d.label),
    datasets: [
      {
        data: dayData.map((d) => d.hours),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>过去7天专注时间</Text>
      <BarChart
        data={chartData}
        width={screenWidth - 80}
        height={220}
        yAxisSuffix="h"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#e2e8f0',
          },
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

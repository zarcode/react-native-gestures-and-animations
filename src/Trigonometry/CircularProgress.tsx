import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Color from "color";
import { Feather as Icon } from "@expo/vector-icons";

export const STROKE_WIDTH = 40;
const styles = StyleSheet.create({
  container: {}
});

interface CircularProgressProps {
  icon: string;
  color: string;
  size: number;
  progress: number;
}

export default ({ color, size, progress, icon }: CircularProgressProps) => {
  const r = size / 2;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeWidth={STROKE_WIDTH}
          {...{
            cx,
            cy,
            r
          }}
        />
      </Svg>
    </View>
  );
};

import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Color from "color";
import { Feather as Icon } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { bInterpolate } from "react-native-redash";

export const STROKE_WIDTH = 40;
const { multiply } = Animated;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    transform: [{ rotate: "-90deg" }],
  },
});
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  icon: string;
  color: string;
  size: number;
  progress: Animated.Node<number>;
}

export default ({ color, size, progress, icon }: CircularProgressProps) => {
  const r = (size - STROKE_WIDTH) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circum = 2 * r * Math.PI;
  const alfa = bInterpolate(progress, 0, 2 * Math.PI);
  const strokeDashoffset = multiply(alfa, r);
  return (
    <View style={styles.container}>
      <Svg style={styles.svg} width={size} height={size}>
        <AnimatedCircle
          stroke={color}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circum} ${circum}`}
          strokeWidth={STROKE_WIDTH}
          {...{
            strokeDashoffset,
            cx,
            cy,
            r,
          }}
        />
      </Svg>
    </View>
  );
};

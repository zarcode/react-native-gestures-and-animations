import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Line, Path } from "react-native-svg";
import Animated from "react-native-reanimated";
import { StyleGuide } from "../components";
import ControlPoint from "./ControlPoint";

const { Value, concat } = Animated;
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const { width } = Dimensions.get("window");
const size = width - 48;
const STROKE_WIDTH = 4;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    width: size + STROKE_WIDTH,
    height: size + STROKE_WIDTH
  }
});

export default () => {
  const min = STROKE_WIDTH / 2;
  const max = min + size;
  const start = {
    x: min,
    y: max
  };
  const end = {
    x: max,
    y: min
  };

  const c1x = new Value(0);
  const c1y = new Value(0);
  const c2x = new Value(0);
  const c2y = new Value(0);

  const d = concat(
    `M ${start.x} ${start.y} C`,
    c1x,
    " ",
    c1y,
    ", ",
    c2x,
    " ",
    c2y,
    ", ",
    `${end.x} ${end.y}`
  );
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Svg style={StyleSheet.absoluteFill}>
          <AnimatedPath
            fill="transparent"
            stroke="black"
            strokeWidth={STROKE_WIDTH}
            {...{ d }}
          />
          <AnimatedLine
            x1={start.x}
            y1={start.y}
            x2={c1x}
            y2={c1y}
            stroke="black"
            strokeWidth={STROKE_WIDTH}
          />
          <AnimatedLine
            x2={c2x}
            y2={c2y}
            x1={end.x}
            y1={end.y}
            stroke="black"
            strokeWidth={STROKE_WIDTH}
          />
        </Svg>
        <ControlPoint point={{ x: c1x, y: c1y }} {...{ min, max }} />
        <ControlPoint point={{ x: c2x, y: c2y }} {...{ min, max }} />
      </View>
    </View>
  );
};

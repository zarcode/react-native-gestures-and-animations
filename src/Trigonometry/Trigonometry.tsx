import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { timing, bInterpolate } from "react-native-redash";
import Animated from "react-native-reanimated";

import CircularProgress, { STROKE_WIDTH } from "./CircularProgress";

const { useCode, Value, set } = Animated;

const { width } = Dimensions.get("window");
const s1 = width - 64;
const s2 = s1 - STROKE_WIDTH * 2;
const s3 = s2 - STROKE_WIDTH * 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000001",
  },
});

export default () => {
  const progress = new Value(0);
  useCode(() => set(progress, timing({ duration: 5000 })), []);
  const d1 = bInterpolate(progress, 0, 0.33);
  const d2 = bInterpolate(progress, 0, 0.5);
  const d3 = bInterpolate(progress, 0, 0.8);
  return (
    <View style={styles.container}>
      <CircularProgress
        size={s1}
        color="#DF0B18"
        progress={d1}
        icon="chevron-right"
      />
      <CircularProgress
        size={s2}
        color="#48E101"
        progress={d2}
        icon="chevrons-right"
      />
      <CircularProgress
        size={s3}
        color="#00C3DD"
        progress={d3}
        icon="chevron-up"
      />
    </View>
  );
};

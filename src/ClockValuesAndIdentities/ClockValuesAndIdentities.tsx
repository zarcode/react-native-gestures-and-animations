import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import { Button, Card, cards } from "../components";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const {
  Value,
  useCode,
  set,
  block,
  clockRunning,
  startClock,
  Clock,
  Extrapolate,
  interpolate,
  add,
  eq,
  cond,
  not,
  stopClock
} = Animated;
const duration = 2000;

export default () => {
  const [show, setShow] = useState(true);
  const { time, clock, progress } = useMemoOne(
    () => ({
      time: new Value(0),
      progress: new Value(0),
      clock: new Clock()
    }),
    []
  );

  const opacity = interpolate(progress, {
    inputRange: [0, 1],
    outputRange: show ? [1, 0] : [0, 1],
    extrapolate: Extrapolate.CLAMP
  });

  useCode(
    () =>
      block([
        cond(not(clockRunning(clock)), [startClock(clock), set(time, clock)]),
        set(
          progress,
          interpolate(clock, {
            inputRange: [time, add(time, duration)],
            outputRange: [0, 1],
            extrapolate: Extrapolate.CLAMP
          })
        ),
        cond(eq(progress, 1), stopClock(clock))
      ]),
    [show]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={{ opacity }}>
          <Card card={cards[0]} />
        </Animated.View>
      </View>
      <Button
        label={show ? "Hide" : "Show"}
        primary
        onPress={() => setShow(!show)}
      />
    </View>
  );
};

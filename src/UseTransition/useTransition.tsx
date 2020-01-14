import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {
  bInterpolate,
  // transformOrigin,
  useTimingTransition
} from "react-native-redash";

import { Button, Card, StyleGuide, cards } from "../components";

const { multiply, interpolate, not } = Animated;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: StyleGuide.spacing * 4
  }
});

const transformOrigin = -(width / 2 - StyleGuide.spacing * 2);

export default () => {
  const [toggled, setToggled] = useState(false);
  const transitionVal = useTimingTransition(toggled, {
    duration: 400,
    easing: Easing.inOut(Easing.ease)
  });
  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const rotation = interpolate(index, {
          inputRange: [0, 1, 2],
          outputRange: [-1, 0, 1]
        });
        const rotate = multiply(
          rotation,
          interpolate(transitionVal, {
            inputRange: [0, 1],
            outputRange: [0, Math.PI / 6]
          })
        );
        return (
          <Animated.View
            key={card.id}
            style={[
              styles.overlay,
              {
                transform: [
                  { translateX: transformOrigin },
                  {
                    rotate
                  },
                  { translateX: -transformOrigin }
                ]
              }
            ]}
          >
            <Card {...{ card }} />
          </Animated.View>
        );
      })}
      <Button
        label={toggled ? "Reset" : "Start"}
        primary
        onPress={() => setToggled(prev => !prev)}
      />
    </View>
  );
};

import * as React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { withOffset } from "../components";
import { canvas2Polar, polar2Canvas } from "react-native-redash";

const { Value, block, event, set, useCode, sub, diffClamp } = Animated;

interface ControlPoint {
  point: {
    x: Animated.Value<number>;
    y: Animated.Value<number>;
  };
  min: number;
  max: number;
}

export default ({ point: { x, y }, min, max }: ControlPoint) => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const x1 = withOffset({ value: translationX, state });
  const y1 = withOffset({ value: translationY, state });
  const translateX = diffClamp(x1, min, max);
  const translateY = diffClamp(y1, min, max);
  const onGestureEvent = event([
    {
      nativeEvent: {
        translationX,
        translationY,
        state
      }
    }
  ]);
  useCode(() => block([set(x, translateX), set(y, translateY)]), [
    translateX,
    translateY,
    x,
    y
  ]);
  return (
    <PanGestureHandler
      onHandlerStateChange={onGestureEvent}
      {...{ onGestureEvent }}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "blue",
          width: 30,
          height: 30,
          borderRadius: 30 / 2,
          transform: [
            { translateX: sub(translateX, 15) },
            { translateY: sub(translateY, 15) }
          ],
          borderColor: "black",
          borderWidth: 5
        }}
      />
    </PanGestureHandler>
  );
};

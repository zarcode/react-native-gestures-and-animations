import * as React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Circle, Rect, G } from "react-native-svg";
import Animated from "react-native-reanimated";
import Constants from "expo-constants";

import { onGestureEvent } from "react-native-redash";
import { Card, StyleGuide, cards } from "../components";
import { CARD_HEIGHT, CARD_WIDTH } from "../components/Card";

const { Value, diffClamp, cond, set, eq, add, sub, interpolate } = Animated;
const { block, useCode, call } = Animated;
const { width, height } = Dimensions.get("window");
const containerWidth = width;
const containerHeight =
  height - Constants.statusBarHeight - (Platform.OS === "ios" ? 44 : 52);

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const INITHEIGHT = 300;
const INITWIDTH = 100;

const SCALE = 0.09;
const ICONSIZE = 412 * SCALE;

const offsetX = new Value((containerWidth - CARD_WIDTH) / 2);
const offsetY = new Value(INITHEIGHT / 2);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
const [card] = cards;

const withOffset = (
  value: Animated.Node<number>,
  state: Animated.Value<State>,
  offset: Animated.Value<number> = new Value(0)
) =>
  cond(
    eq(state, State.END),
    [set(offset, add(offset, value)), offset],
    [add(offset, value)]
  );

export default () => {
  const state = new Value(State.UNDETERMINED);
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const gestureHandler = onGestureEvent({
    state,
    translationX,
    translationY,
    velocityX,
    velocityY,
  });

  const onSnap = ([x]: readonly number[]) => {
    // console.log(INITHEIGHT - x);
  };

  const translateX = diffClamp(
    withOffset(translationX, state, offsetX),
    0,
    containerWidth - CARD_WIDTH
  );
  const translateY = diffClamp(
    withOffset(translationY, state, offsetY),
    0,
    INITHEIGHT
  );

  useCode(() => block([call([translateY], onSnap)]), [translateY]);

  const progress = sub(INITHEIGHT, translateY);

  const raysSize = interpolate(progress, {
    inputRange: [0, INITHEIGHT],
    outputRange: [20, 76],
  });

  const coreSize = interpolate(progress, {
    inputRange: [0, INITHEIGHT],
    outputRange: [70, 90],
  });

  return (
    <View style={styles.container}>
      <Svg
        style={{
          width: ICONSIZE,
          height: ICONSIZE,
          marginBottom: 40,
        }}
      >
        <G transform={`scale(${SCALE},${SCALE})`}>
          <AnimatedCircle cx="206" cy="206" r={coreSize} />

          <AnimatedRect
            transform="translate(206.449341, 38.670000) scale(1, -1) translate(-206.449341, -38.670000) "
            x="196.12"
            y="0.67"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(324.804005, 87.164005) scale(-1, -1) rotate(45.000000) translate(-324.804005, -87.164005) "
            x="314.474664"
            y="49.164005"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(373.320000, 206.429341) scale(-1, 1) rotate(90.000000) translate(-373.320000, -206.429341) "
            x="362.990659"
            y="168.429341"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(324.824005, 324.824005) scale(-1, -1) rotate(135.000000) translate(-324.824005, -324.824005) "
            x="314.494664"
            y="286.824005"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(206.449341, 373.350000) scale(1, -1) rotate(180.000000) translate(-206.449341, -373.350000) "
            x="196.12"
            y="335.35"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(87.174005, 324.824005) scale(-1, -1) rotate(225.000000) translate(-87.174005, -324.824005) "
            x="76.8446637"
            y="286.824005"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(38.650000, 209.149341) scale(-1, 1) rotate(270.000000) translate(-38.650000, -209.149341) "
            x="28.3206587"
            y="171.149341"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
          <AnimatedRect
            transform="translate(86.274005, 87.174005) scale(-1, -1) rotate(315.000000) translate(-86.274005, -87.174005) "
            x="75.9446637"
            y="49.174005"
            width="20.6586826"
            height={raysSize}
            rx="10.3293413"
          />
        </G>
      </Svg>
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            width: INITWIDTH,
            height: INITHEIGHT,
            backgroundColor: "black",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: INITWIDTH,
              height: progress,
              backgroundColor: "red",
            }}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

import React from "react";
import { Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { panGestureHandler } from "react-native-redash";

import Card, {
  CardProps,
  CARD_HEIGHT as INNER_CARD_HEIGHT
} from "../components/Card";

export const CARD_HEIGHT = INNER_CARD_HEIGHT + 32;
const { width } = Dimensions.get("window");
const {
  Value,
  eq,
  cond,
  useCode,
  divide,
  floor,
  max,
  multiply,
  block,
  set,
  diff,
  lessThan,
  add,
  greaterThan,
  abs,
  not,
  startClock,
  spring,
  Clock
} = Animated;

interface SortableCardProps extends CardProps {
  offsets: Animated.Value<number>[];
  index: number;
}

const withOffset = (
  value: Animated.Value<number>,
  state: Animated.Value<State>,
  offset: Animated.Value<number>
) => {
  const safeOffset = new Value(0);
  return cond(eq(state, State.ACTIVE), add(safeOffset, value), [
    set(safeOffset, offset),
    safeOffset
  ]);
};

const withTransition = (
  value: Animated.Node<number>,
  velocity: Animated.Value<number>,
  gestureState: Animated.Value<State> = new Value(State.UNDETERMINED),
  springConfig?: Partial<Omit<Animated.SpringConfig, "toValue">>
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    ...springConfig
  };
  return block([
    startClock(clock),
    set(config.toValue, value),
    // spring(clock, state, config),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.velocity, velocity), set(state.position, value)],
      spring(clock, state, config)
    ),
    state.position
  ]);
};

export default ({ card, index, offsets }: SortableCardProps) => {
  const {
    gestureHandler,
    translationX,
    velocityX,
    translationY,
    velocityY,
    state
  } = panGestureHandler();
  const zIndex = cond(eq(state, State.ACTIVE), 100, 1);

  const x = withOffset(translationX, state, 0);
  const translateX = withTransition(x, velocityX, state);
  const y = withOffset(translationY, state, offsets[index]);
  const currentOffset = multiply(
    max(floor(divide(y, CARD_HEIGHT)), 0),
    CARD_HEIGHT
  );
  const translateY = withTransition(y, velocityY, state);

  useCode(
    () =>
      block(
        offsets.map(offset =>
          cond(eq(offset, currentOffset), [
            set(offset, offsets[index]),
            set(offsets[index], currentOffset)
          ])
        )
      ),
    []
  );
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height: CARD_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateY }, { translateX }],
          zIndex
        }}
      >
        <Card {...{ card }} />
      </Animated.View>
    </PanGestureHandler>
  );
};

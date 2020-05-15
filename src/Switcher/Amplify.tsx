import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import { onGestureEvent } from "react-native-redash";

const { Value, diffClamp, cond, set, eq, add, sub } = Animated;
const { block, useCode, call } = Animated;

const INITHEIGHT = 300;
const INITWIDTH = 100;
const INIT_BORDER_RADIUS = 15;

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

interface AmplifyProps {
  height: number;
  width: number;
  borderRadius: number;
  initialValue: number;
  onChange: (value: number) => void;
}

const Amplify = ({
  height: itemsHeight,
  width: itemWidth,
  borderRadius: itemBorderRadius,
  initialValue,
  onChange,
}: AmplifyProps) => {
  const initialTranslationY = ((100 - initialValue) * itemsHeight) / 100;

  const { state, translationY, velocityX, velocityY, offsetY } = useMemoOne(
    () => ({
      state: new Value(State.UNDETERMINED),
      translationY: new Value(0),
      velocityX: new Value(0),
      velocityY: new Value(0),
      offsetY: new Value(0),
    }),
    []
  );

  useEffect(() => {
    translationY.setValue(initialTranslationY);
  }, [translationY, initialTranslationY]);

  const gestureHandler = onGestureEvent({
    state,
    translationY,
    velocityX,
    velocityY,
  });

  let handler: ReturnType<typeof setTimeout>;

  const onSnap = ([x]: readonly number[]) => {
    clearTimeout(handler);

    handler = setTimeout(() => {
      onChange((100 * (itemsHeight - x)) / itemsHeight);
    }, 400);
  };

  // v = 300x/100

  const translateY = diffClamp(
    withOffset(translationY, state, offsetY),
    0,
    itemsHeight
  );

  useCode(() => block([call([translateY], onSnap)]), [translateY]);

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          width: itemWidth,
          height: itemsHeight,
          backgroundColor: "black",
          borderRadius: itemBorderRadius,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: itemWidth,
            height: sub(itemsHeight, translateY),
            backgroundColor: "red",
          }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

Amplify.defaultProps = {
  width: INITWIDTH,
  height: INITHEIGHT,
  borderRadius: INIT_BORDER_RADIUS,
  initialValue: 0,
};

export default React.memo(Amplify);

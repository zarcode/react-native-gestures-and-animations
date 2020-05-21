import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import { onGestureEvent } from "react-native-redash";

const {
  Value,
  diffClamp,
  cond,
  set,
  eq,
  add,
  sub,
  debug,
  defined,
  not,
} = Animated;
const { block, useCode, call } = Animated;

const INITHEIGHT = 300;
const INITWIDTH = 100;
const INIT_BORDER_RADIUS = 15;

const withOffset = (
  value: Animated.Node<number>,
  gestureState: Animated.Value<State>,
  offset: Animated.Value<number> = new Value(0)
) => {
  const safeOffset: Animated.Value<number> = new Value(-1);

  return block([
    debug("safeOffset", safeOffset),
    cond(
      eq(safeOffset, -1), // ako nije definisan
      [
        debug("postavi", offset),
        set(safeOffset, offset === undefined ? 0 : offset),
      ] // postavi na 0 ili ofset iz args
    ),
    // cond(
    //   eq(gestureState, State.END),
    //   [set(offset, add(offset, value)), offset],
    //   [add(offset, value)]
    // );

    cond(
      eq(gestureState, State.ACTIVE),
      [debug("active", value), add(safeOffset, value)],
      [
        // debug("sacuvaj state", gestureState),
        // debug("sacuvaj value", value),
        debug("sacuvaj of", value),
        // ako je aktivna animacija stavi vrednost da bude ofset
        set(safeOffset, add(safeOffset, value)), // kad se zavrsi na safe ofset dodaj value
      ]
    ),
  ]);
};

// const withOffset = (
//   value: Animated.Node<number>,
//   state: Animated.Value<State>,
//   offset: Animated.Value<number> = new Value(0)
// ) =>
//   cond(
//     eq(state, State.END),
//     [set(offset, add(offset, value)), offset],
//     [add(offset, value)]
//   );

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
  modal,
}: AmplifyProps) => {
  const initialTranslationY = ((100 - initialValue) * itemsHeight) / 100;

  // const state = new Value(State.UNDETERMINED);
  const translationY = new Value(0);

  const { state } = useMemoOne(() => {
    return {
      state: new Value(State.UNDETERMINED),
      translationY: new Value(0),
      offsetY: new Value(initialTranslationY),
    };
  }, []);

  const gestureHandler = onGestureEvent({
    state,
    translationY,
  });

  let handler: ReturnType<typeof setTimeout>;

  const onSnap = ([x]: readonly number[]) => {
    clearTimeout(handler);

    const newValue = (100 * (itemsHeight - x)) / itemsHeight;

    // console.log("newValue", newValue);
    // console.log("initialValue", initialValue);
    handler = setTimeout(() => {
      if (newValue !== initialValue) {
        onChange(newValue);
      }
    }, 400);
  };

  // v = 300x/100

  const tY = withOffset(translationY, state, new Value(initialTranslationY));

  const translateY = tY;
  // const translateY = diffClamp(tY, 0, itemsHeight);
  // const translateY = tY;

  // const test = new Value();
  // const test = new Value(undefined);
  useCode(
    () =>
      block([
        // debug("tY", tY),
        // debug("translateY", translateY),
        // debug("offsetY", offsetY),
        call([translateY], onSnap),
      ]),
    [translateY]
  );

  return (
    <PanGestureHandler {...gestureHandler} key={initialValue}>
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

export default React.memo(Amplify, (prevProps, nextProps) => {
  return prevProps.initialValue === nextProps.initialValue;
});

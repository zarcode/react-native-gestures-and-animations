import React, { useRef } from "react";
import { View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import { diffClamp, onGestureEvent } from "react-native-redash";
import Sun from "./Sun";

const Icon = ({ scale, translateY, itemsHeight, wrapStyle, color }) => (
  <View
    style={[
      {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
      },
      wrapStyle,
    ]}
  >
    <Sun
      maxValue={itemsHeight}
      translateY={translateY}
      color={color}
      scale={scale}
    />
  </View>
);

const { Value, cond, set, eq, add, sub, block, useCode, call } = Animated;

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
    cond(eq(safeOffset, -1), [
      set(safeOffset, offset === undefined ? 0 : offset),
    ]),

    cond(
      eq(gestureState, State.ACTIVE),
      [add(safeOffset, value)],
      [set(safeOffset, add(safeOffset, value))]
    ),
  ]);
};

interface AmplifyProps {
  height: number;
  width: number;
  borderRadius: number;
  initialValue: number;
  onChange: (value: number) => void;
  inModal?: boolean;
}

const Amplify = ({
  height: itemsHeight,
  width: itemWidth,
  borderRadius: itemBorderRadius,
  initialValue,
  onChange,
  inModal,
  Wrapper,
}: AmplifyProps) => {
  const initialTranslationY = ((100 - initialValue) * itemsHeight) / 100;

  const translationY = new Value(0);

  const { state } = useMemoOne(() => {
    return {
      state: new Value(State.UNDETERMINED),
    };
  }, []);

  const gestureHandler = onGestureEvent({
    state,
    translationY,
  });

  const handler = useRef<ReturnType<typeof setTimeout>>();

  const translateY = diffClamp(
    withOffset(translationY, state, new Value(initialTranslationY)),
    0,
    itemsHeight
  );

  useCode(() => {
    const onSnap = ([x]: readonly number[]) => {
      clearTimeout(handler.current);

      const newValue = (100 * (itemsHeight - x)) / itemsHeight;

      handler.current = setTimeout(() => {
        if (newValue !== initialValue) {
          onChange(newValue);
        }
      }, 400);
    };
    return block([call([translateY], onSnap)]);
  }, [translateY, onChange, initialValue, itemsHeight]);

  return (
    <View>
      {inModal && (
        <Icon
          color="black"
          scale={0.1}
          wrapStyle={{ top: "auto", bottom: "auto", height: "auto" }}
          {...{ translateY, itemsHeight }}
        />
      )}
      <Wrapper>
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
            {!inModal && (
              <Icon
                color="yellow"
                scale={0.089}
                {...{ translateY, itemsHeight }}
              />
            )}
          </Animated.View>
        </PanGestureHandler>
      </Wrapper>
    </View>
  );
};

Amplify.defaultProps = {
  width: INITWIDTH,
  height: INITHEIGHT,
  borderRadius: INIT_BORDER_RADIUS,
  initialValue: 0,
};

export default React.memo(Amplify);

import React, { useRef } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import Amplify from "./Amplify";
import { Position } from "./Model";
import { createValue, timing, timingBack } from "./Timing";
const { width: wWidth, height: wHeight } = Dimensions.get("window");
const sliderWidth = 100;
const sliderHeight = 300;
const sliderX = (wWidth - sliderWidth) / 2;
const sliderY = (wHeight - sliderHeight) / 2;

const {
  Value,
  diffClamp,
  cond,
  set,
  eq,
  add,
  sub,
  useCode,
  clockRunning,
  block,
  call,
  debug,
} = Animated;

interface ModalProps {
  position: Position;
  close: () => void;
}

const Modal = ({
  close,
  position,
  shouldClose,
  prepareForClose,
  value,
  setValue,
}: ModalProps) => {
  // indicate animation is done
  const hasOpened = useRef(false);

  // run when animation is done
  const setOpened = () => {
    hasOpened.current = true;
  };

  const applyValue = (v) => {
    // only set value when animation is done
    if (!hasOpened.current) {
      return false;
    }

    setValue(v);
  };

  const width = createValue(position.width);
  const height = createValue(position.height);
  const x = createValue(position.x);
  const y = createValue(position.y);
  const opacity = createValue(0);
  const scale = createValue(1);
  const borderRadius = createValue(6);
  const p = {
    position: "absolute",
    width: width.value,
    height: height.value,
    left: x.value,
    top: y.value,
  };

  useCode(
    () =>
      block([
        cond(
          shouldClose,
          [
            timingBack(width, sliderWidth, position.width),
            timingBack(height, sliderHeight, position.height),
            timingBack(x, sliderX, position.x),
            timingBack(y, sliderY, position.y),
            timingBack(borderRadius, 15, 6),
            timingBack(opacity, 1, 0),
            cond(eq(clockRunning(width.clock), 0), call([], close)),
          ],
          [
            timing(width, position.width, sliderWidth),
            timing(height, position.height, sliderHeight),
            timing(x, position.x, sliderX),
            timing(y, position.y, sliderY),
            timing(borderRadius, 6, 15),
            timing(opacity, 0, 1),
            cond(eq(clockRunning(width.clock), 0), call([], setOpened)),
          ]
        ),
      ]),
    [
      width,
      height,
      position,
      borderRadius,
      shouldClose,
      opacity,
      x,
      y,
      scale,
      close,
    ]
  );
  // console.log(value);
  return (
    <>
      <TouchableWithoutFeedback onPress={prepareForClose}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: "yellow" }]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          p,
          {
            backgroundColor: "blue",
            // borderRadius: borderRadius.value
          },
        ]}
      >
        <Animated.View
          style={[
            {
              opacity: opacity.value,
              // borderRadius: borderRadius.value
            },
          ]}
        >
          <Amplify
            height={300}
            width={100}
            borderRadius={15}
            initialValue={value}
            onChange={applyValue}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default React.memo(Modal, () => true);

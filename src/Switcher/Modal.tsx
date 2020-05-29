import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useMemoOne } from "use-memo-one";
import Amplify from "./Amplify";
import { Position, largeDim, smallDim } from "./Model";
import { createValue, timing, timingBack } from "./Timing";

const { width: wWidth, height: wHeight } = Dimensions.get("window");
const sliderWidth = 100;
const sliderHeight = 300;
const sliderX = (wWidth - sliderWidth) / 2;
const sliderY = (wHeight - sliderHeight) / 2;

const { cond, eq, useCode, clockRunning, block, call } = Animated;

interface ModalProps {
  position: Position;
  close: () => void;
  prepareForClose: (value: number) => void;
  shouldClose: Animated.Value<0 | 1>;
  value: number;
}

const Modal = ({
  close,
  position,
  shouldClose,
  prepareForClose,
  value,
}: ModalProps) => {
  const [amplifyValue, setAmplifyValue] = useState(value);

  const { width, height, x, y, opacity, borderRadius } = useMemoOne(
    () => ({
      width: createValue(position.width),
      height: createValue(position.height),
      x: createValue(position.x),
      y: createValue(position.y),
      opacity: createValue(0),
      // scale: createValue(1),
      borderRadius: createValue(6),
    }),
    [position.width, position.height, position.x, position.y]
  );

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
            // cond(eq(clockRunning(width.clock), 0), call([], setOpened)),
          ]
        ),
      ]),
    [width, height, position, borderRadius, shouldClose, opacity, x, y, close]
  );

  return (
    <>
      <TouchableWithoutFeedback onPress={() => prepareForClose(amplifyValue)}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: "yellow" }]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          p,
          {
            borderRadius: borderRadius.value,
            overflow: "hidden",
          },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "black" }]}>
          <View
            style={[
              {
                position: "absolute",
                left: 0,
                bottom: 0,
                right: 0,
                height: (value * smallDim.height) / 100,
                backgroundColor: "red",
              },
            ]}
          />
        </View>
        <Animated.View
          style={[
            {
              zIndex: 1,
              opacity: opacity.value,
              // borderRadius: borderRadius.value
            },
          ]}
        >
          <Amplify
            height={largeDim.height}
            width={largeDim.width}
            borderRadius={largeDim.borderRadius}
            initialValue={value}
            onChange={setAmplifyValue}
          />
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default React.memo(Modal);

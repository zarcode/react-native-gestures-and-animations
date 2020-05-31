import React, { useEffect, useRef, useState } from "react";
import Animated from "react-native-reanimated";
import { Constants } from "expo";
import { Platform, TouchableWithoutFeedback, View } from "react-native";
import Amplify from "./Amplify";
import { Position, smallDim } from "./Model";

const offset = (v: number) =>
  (Platform.OS === "android" ? v + Constants.statusBarHeight : v) - 88;
const measure = async (ref: View): Promise<Position> =>
  new Promise((resolve) =>
    ref.measureInWindow((x: number, y: number, width: number, height: number) =>
      resolve({
        x,
        y: offset(y),
        width,
        height,
      })
    )
  );

interface ControlProps {
  open: (position: Position, v: number) => void;
  value: number;
}

const Wrapper = ({ children }) => [children];

const Control = ({ open, value }: ControlProps) => {
  const [amplifyValue, setAmplifyValue] = useState(value);

  useEffect(() => {
    setAmplifyValue(value);
  }, [value]);
  // for measure
  const item = useRef(null);

  const startTransition = async () => {
    const p = await measure(item.current.getNode());
    open(p, amplifyValue);
  };

  return (
    <TouchableWithoutFeedback onLongPress={startTransition}>
      <Animated.View ref={item} style={[{ width: smallDim.width }]}>
        <Amplify
          inModal={false}
          height={smallDim.height}
          width={smallDim.width}
          borderRadius={smallDim.borderRadius}
          initialValue={value}
          onChange={setAmplifyValue}
          Wrapper={Wrapper}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Control;

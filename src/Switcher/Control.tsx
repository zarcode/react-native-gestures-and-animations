import React, { useRef, useState } from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { LongPressGestureHandler } from "react-native-gesture-handler";
import { DangerZone, Constants } from "expo";
import {
  Platform,
  // StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Amplify from "./Amplify";
import { Position } from "./Model";

const offset = (v: number) =>
  (Platform.OS === "android" ? v + Constants.statusBarHeight : v) - 88;
const measure = async (ref: View | Text | ScrollView): Promise<Position> =>
  new Promise((resolve) =>
    ref.measureInWindow((x, y, width, height) =>
      resolve({
        x,
        y: offset(y),
        width,
        height,
      })
    )
  );

interface ControlProps {
  open: (position: Position) => void;
}

const Control = ({ open }: ControlProps) => {
  const [amplifyValue, setAmplifyValue] = useState(0);

  // for measure
  const item = useRef(null);

  const startTransition = async () => {
    // if (position === null) {
    const p = await measure(item.current.getNode());
    open(p);
    // }
  };

  return (
    <>
      <TouchableWithoutFeedback onLongPress={startTransition}>
        <Animated.View
          ref={item}
          style={[
            { width: 30 },
            // { opacity: cond(eq(activeAppId, app.id), 0, 1) }
          ]}
        >
          <Amplify
            height={100}
            width={30}
            borderRadius={6}
            initialValue={0}
            onChange={setAmplifyValue}
          />
        </Animated.View>
        {/* <LongPressGestureHandler onGestureEvent={startTransition}>
          <Text>LongPressGestureHandler</Text>
        </LongPressGestureHandler> */}
      </TouchableWithoutFeedback>
    </>
  );
};

export default Control;

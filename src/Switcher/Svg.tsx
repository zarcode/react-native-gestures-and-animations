import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useMemoOne } from "use-memo-one";
import Animated from "react-native-reanimated";
import { StyleGuide } from "../components";
import Control from "./Control";
import Modal from "./Modal";
import { Position } from "./Model";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: StyleGuide.palette.background,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
const IOSAmply = () => {
  const [position, setPosition] = useState(null);
  const [value, setValue] = useState(0);

  const { shouldClose } = useMemoOne(
    () => ({
      shouldClose: new Animated.Value(0) as Animated.Value<0 | 1>,
    }),
    []
  );

  const open = (p: Position) => {
    setPosition(p);
  };

  const close = () => {
    setPosition(null);
  };

  // prepare for closing
  const prepareForClose = () => {
    shouldClose.setValue(1);
  };

  // when position is set to null prepare for opening
  useEffect(() => {
    if (position !== null) {
      shouldClose.setValue(0);
    }
  }, [shouldClose, position]);

  return (
    <React.Profiler
      id="test1"
      onRender={(...args) => {
        // { [1]: phase, [2]: actualDuraction } = args;

        // console.log({ phase, actualDuration })
        console.log(args);
      }}
    >
      <View style={styles.container}>
        <View style={{ marginTop: 100, marginLeft: 10 }}>
          <Control open={open} setValue={setValue} />
        </View>
        {position !== null && (
          <Modal
            close={close}
            position={position}
            prepareForClose={prepareForClose}
            shouldClose={shouldClose}
            // value,
            setValue={setValue}
          />
        )}
      </View>
    </React.Profiler>
  );
};

export default IOSAmply;

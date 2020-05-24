import React, { useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useMemoOne } from "use-memo-one";
import Animated from "react-native-reanimated";
import { StyleGuide } from "../components";
import Control from "./Control";
import Modal from "./Modal";
import { Position } from "./Model";

const { Value, block, useCode, debug, defined } = Animated;

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

  const open = (p: Position, v) => {
    console.log("open", v);
    setValue(v);
    setPosition(p);
  };

  // const close = () => {
  //   // setPosition(null);
  // };

  const close = useCallback(() => {
    setPosition(null);
  }, []);

  // prepare for closing
  // const prepareForClose = () => {
  //   shouldClose.setValue(1);
  // };

  const prepareForClose = useCallback((v) => {
    setValue(v);
    shouldClose.setValue(1);
  }, []);

  // when position is set to null prepare for opening
  useEffect(() => {
    if (position !== null) {
      shouldClose.setValue(0);
    }
  }, [shouldClose, position]);

  // useEffect(() => {
  //   console.log("shouldClose");
  // }, [shouldClose]);

  // useEffect(() => {
  //   console.log("position", position);
  // }, [position]);

  useEffect(() => {
    console.log("value", value);
  }, [value]);

  // useEffect(() => {
  //   console.log("prepareForClose", prepareForClose);
  // }, [prepareForClose]);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 100, marginLeft: 10 }}>
        <Control open={open} value={value} />
      </View>
      {position !== null && (
        <Modal
          close={close}
          position={position}
          prepareForClose={prepareForClose}
          shouldClose={shouldClose}
          value={value}
        />
      )}
    </View>
  );
};

export default IOSAmply;

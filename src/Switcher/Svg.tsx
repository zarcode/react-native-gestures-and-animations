import React, { useCallback, useEffect, useState } from "react";
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
  },
});
const IOSAmply = () => {
  const [position, setPosition] = useState<Position | null>(null);
  const [value, setValue] = useState(0);

  const { shouldClose } = useMemoOne(
    () => ({
      shouldClose: new Animated.Value(0) as Animated.Value<0 | 1>,
    }),
    []
  );

  const open = useCallback((p: Position, v: number) => {
    setValue(v);
    setPosition(p);
  }, []);

  const close = useCallback(() => {
    setPosition(null);
  }, []);

  const prepareForClose = useCallback(
    (v) => {
      setValue(v);
      shouldClose.setValue(1);
    },
    [shouldClose]
  );

  // when position is set to null prepare for opening
  useEffect(() => {
    if (position !== null) {
      shouldClose.setValue(0);
    }
  }, [shouldClose, position]);

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

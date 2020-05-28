import { DangerZone } from "expo";

import { timing as runTiming } from "react-native-redash";

import Animated, { Easing } from "react-native-reanimated";
const {
  Value,
  Clock,
  cond,
  eq,
  stopClock,
  set,
  clockRunning,
  block,
} = Animated;

const easing = Easing.inOut(Easing.ease);

export interface TimingValue {
  value: Animated.Value<number>;
  clock: Animated.Clock;
  hasTimed: Animated.Value<1 | 0>;
  hasTimedBack: Animated.Value<1 | 0>;
}

export const createValue = (val: number): TimingValue => ({
  value: new Value(val),
  clock: new Clock(),
  hasTimed: new Value(0),
  hasTimedBack: new Value(0),
});

export const timing = (
  v: TimingValue,
  from: number,
  to: number,
  back: "hasTimed" | "hasTimedBack" = "hasTimed"
): Animated.Node<number> =>
  cond(eq(v[back], 0), [
    set(
      v.value,
      runTiming({
        clock: v.clock,
        from,
        to,
        duration: 200,
        easing,
      })
    ),
    cond(eq(clockRunning(v.clock), 0), set(v[back], 1)),
  ]);

export const timingBack = (
  v: TimingValue,
  from: number,
  to: number
): Animated.Node<number> =>
  block([
    cond(eq(v.hasTimed, 0), [stopClock(v.clock), set(v.hasTimed, 1)]),
    timing(v, from, to, "hasTimedBack"),
  ]);

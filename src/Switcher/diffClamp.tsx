import Animated from "react-native-reanimated";

const { cond, diff, set, add, proc, eq, min, max, Value, not } = Animated;

const procAcc = proc(function(a, minVal, maxVal, value) {
  return set(
    value,
    min(max(add(cond(not(eq(value, -1)), value, a), diff(a)), minVal), maxVal)
  );
});

export default function diffClamp(a, minVal, maxVal) {
  const value = new Value(-1);
  return procAcc(a, minVal, maxVal, value);
}

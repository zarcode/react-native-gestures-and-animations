import Animated from "react-native-reanimated";

const {
  cond,
  diff,
  set,
  add,
  proc,
  eq,
  min,
  max,
  Value,
  not,
  block,
  debug,
} = Animated;

const procAcc = proc(function(a, minVal, maxVal, value) {
  return block([
    debug("a", a),
    debug("value1", value),
    debug("diff(a)", diff(a)),
    debug("not(eq(value, -1)", not(eq(value, -1))),
    debug(
      "cond(not(eq(value, -1)), value, a)",
      cond(not(eq(value, -1)), value, a)
    ),
    debug(
      "add(cond(not(eq(value, -1)), value, a), diff(a))",
      add(cond(not(eq(value, -1)), value, a), diff(a))
    ),
    debug(
      "max(add(cond(not(eq(value, -1)), value, a), diff(a)), minVal)",
      max(add(cond(not(eq(value, -1)), value, a), diff(a)), minVal)
    ),
    set(
      value,
      min(max(add(cond(not(eq(value, -1)), value, a), diff(a)), minVal), maxVal)
    ),
  ]);
});

export default function diffClamp(a, minVal, maxVal) {
  const value = new Value(-1);
  return procAcc(a, minVal, maxVal, value);
}

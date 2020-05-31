import React from "react";
import Svg, { Circle, Rect, G } from "react-native-svg";
import Animated from "react-native-reanimated";

const { interpolate, sub } = Animated;
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SunProps {
  maxValue: number;
  translateY: Animated.Node<number>;
  color: string;
  scale: number;
}

const Sun = ({ maxValue, translateY, color, scale }: SunProps) => {
  const ICONSIZE = 412 * scale;

  const progress = sub(maxValue, translateY);

  const raysSize = interpolate(progress, {
    inputRange: [0, maxValue],
    outputRange: [20, 76],
  });

  const coreSize = interpolate(progress, {
    inputRange: [0, maxValue],
    outputRange: [70, 90],
  });

  return (
    <Svg
      style={{
        width: ICONSIZE,
        height: ICONSIZE,
        marginBottom: 40,
      }}
    >
      <G transform={`scale(${scale},${scale})`}>
        <AnimatedCircle cx="206" cy="206" r={coreSize} fill={color} />

        <AnimatedRect
          transform="translate(206.449341, 38.670000) scale(1, -1) translate(-206.449341, -38.670000) "
          x="196.12"
          y="0.67"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(324.804005, 87.164005) scale(-1, -1) rotate(45.000000) translate(-324.804005, -87.164005) "
          x="314.474664"
          y="49.164005"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(373.320000, 206.429341) scale(-1, 1) rotate(90.000000) translate(-373.320000, -206.429341) "
          x="362.990659"
          y="168.429341"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(324.824005, 324.824005) scale(-1, -1) rotate(135.000000) translate(-324.824005, -324.824005) "
          x="314.494664"
          y="286.824005"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(206.449341, 373.350000) scale(1, -1) rotate(180.000000) translate(-206.449341, -373.350000) "
          x="196.12"
          y="335.35"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(87.174005, 324.824005) scale(-1, -1) rotate(225.000000) translate(-87.174005, -324.824005) "
          x="76.8446637"
          y="286.824005"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(38.650000, 209.149341) scale(-1, 1) rotate(270.000000) translate(-38.650000, -209.149341) "
          x="28.3206587"
          y="171.149341"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
        <AnimatedRect
          transform="translate(86.274005, 87.174005) scale(-1, -1) rotate(315.000000) translate(-86.274005, -87.174005) "
          x="75.9446637"
          y="49.174005"
          width="20.6586826"
          height={raysSize}
          rx="10.3293413"
          fill={color}
        />
      </G>
    </Svg>
  );
};

export default Sun;

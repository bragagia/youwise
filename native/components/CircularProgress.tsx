import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CircularProgressView = ({
  progress,
  doneColor = "#000000",
  backgroundColor = "#e0e0e0",
  size = 11,
}: {
  progress: number;
  doneColor?: string;
  backgroundColor?: string;
  size?: number;
}) => {
  return (
    <AnimatedCircularProgress
      size={size}
      width={size / 3.8}
      fill={progress * 100}
      lineCap="round"
      tintColor={doneColor}
      backgroundColor={backgroundColor}
      rotation={0}
    />
  );
};

export default CircularProgressView;

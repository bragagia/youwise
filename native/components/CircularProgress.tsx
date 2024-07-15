import React from "react";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CircularProgressView = ({ progress }: { progress: number }) => {
  return (
    <AnimatedCircularProgress
      size={11}
      width={3}
      fill={progress * 100}
      lineCap="round"
      tintColor="#000000"
      backgroundColor="#E0E0E0"
      rotation={0}
    />
  );
};

export default CircularProgressView;

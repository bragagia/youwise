import React from "react";

const LoudlyCryingFace = require("@/assets/images/loudly-crying-face.png");
const Tada = require("@/assets/images/tada.png");

import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const ArrowArcLeft: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 200, ...props }) => {
  return (
    <Svg
      stroke={color}
      fill={color}
      strokeWidth="0"
      viewBox="0 0 256 256"
      height={size}
      width={size}
      {...props}
    >
      <Path d="M230,184a6,6,0,0,1-12,0A90,90,0,0,0,64.36,120.36L38.55,146H88a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V88a6,6,0,0,1,12,0v49.58l25.89-25.72A102,102,0,0,1,230,184Z" />
    </Svg>
  );
};

const ArrowArcRight: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 200, ...props }) => {
  return (
    <Svg
      stroke={color}
      fill={color}
      strokeWidth={0}
      viewBox="0 0 256 256"
      height={size}
      width={size}
      {...props}
    >
      <G transform="scale(-1, 1) translate(-256, 0)">
        <Path d="M230,184a6,6,0,0,1-12,0A90,90,0,0,0,64.36,120.36L38.55,146H88a6,6,0,0,1,0,12H24a6,6,0,0,1-6-6V88a6,6,0,0,1,12,0v49.58l25.89-25.72A102,102,0,0,1,230,184Z" />
      </G>
    </Svg>
  );
};

const ArrowUTurnLeft: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 24, ...props }) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      height={size}
      width={size}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
      />
    </Svg>
  );
};

const ArrowDown: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "black", size = 18, ...props }) => {
  const aspectRatio = 15.166 / 18.4473;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;

  return (
    <Svg viewBox="0 0 15.166 18.4473" width={width} height={height} {...props}>
      <G>
        <Rect height="18.4473" opacity={0} width="15.166" x={0} y={0} />
        <Path
          d="M7.40234 0C6.89453 0 6.5332 0.351562 6.5332 0.859375L6.5332 13.7207L6.63086 16.6309L7.17773 16.4355L3.68164 12.5977L1.45508 10.4102C1.30859 10.2539 1.07422 10.1758 0.839844 10.1758C0.351562 10.1758 0 10.5469 0 11.0254C0 11.2598 0.0878906 11.4648 0.273438 11.6602L6.74805 18.1543C6.93359 18.3496 7.1582 18.4473 7.40234 18.4473C7.64648 18.4473 7.87109 18.3496 8.05664 18.1543L14.541 11.6602C14.7266 11.4648 14.8047 11.2598 14.8047 11.0254C14.8047 10.5469 14.4531 10.1758 13.9648 10.1758C13.7305 10.1758 13.5059 10.2539 13.3496 10.4102L11.123 12.5977L7.61719 16.4355L8.17383 16.6309L8.27148 13.7207L8.27148 0.859375C8.27148 0.351562 7.91016 0 7.40234 0Z"
          fill={color}
        />
      </G>
    </Svg>
  );
};

const ArrowTriangleHeadClockwise: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "black", size = 24, ...props }) => {
  const aspectRatio = 20.2832 / 23.7233;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;

  return (
    <Svg viewBox="0 0 20.2832 23.7233" width={width} height={height} {...props}>
      <G>
        <Rect height="23.7233" opacity={0} width="20.2832" x={0} y={0} />
        <Path
          d="M9.96094 21.8177C15.459 21.8177 19.9219 17.3548 19.9219 11.8568C19.9219 8.50718 18.291 5.60679 15.7715 3.79038C15.3418 3.45835 14.7852 3.57554 14.541 3.96616C14.2969 4.37632 14.4238 4.8353 14.8242 5.13804C16.8945 6.62241 18.2617 9.07358 18.2617 11.8568C18.2617 16.4466 14.5508 20.1576 9.96094 20.1576C5.37109 20.1576 1.66016 16.4466 1.66016 11.8568C1.66016 7.89194 4.4043 4.62046 8.07617 3.77085L8.07617 5.1771C8.07617 5.87046 8.55469 6.04624 9.0918 5.67515L12.207 3.48765C12.6465 3.17515 12.6562 2.7064 12.207 2.38413L9.10156 0.19663C8.55469-0.184229 8.07617-0.00844799 8.07617 0.694677L8.07617 2.0814C3.50586 2.94077 0 6.98374 0 11.8568C0 17.3548 4.46289 21.8177 9.96094 21.8177Z"
          fill={color}
          fillOpacity={0.85}
          stroke={color}
          strokeWidth={0.8}
        />
      </G>
    </Svg>
  );
};

const Bars3: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "black", size = 24, ...props }) => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke={color}
      height={size}
      width={size}
      {...props}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </Svg>
  );
};

const Checkmark: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 17.1875 / 17.2363;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;

  return (
    <Svg viewBox="0 0 17.1875 17.2363" width={width} height={height} {...props}>
      <G>
        <Rect height="17.2363" opacity={0} width="17.1875" x={0} y={0} />
        <Path
          d="M6.36719 17.2363C6.78711 17.2363 7.11914 17.0508 7.35352 16.6895L16.582 2.1582C16.7578 1.875 16.8262 1.66016 16.8262 1.43555C16.8262 0.898438 16.4746 0.546875 15.9375 0.546875C15.5469 0.546875 15.332 0.673828 15.0977 1.04492L6.32812 15.0195L1.77734 9.0625C1.5332 8.7207 1.28906 8.58398 0.9375 8.58398C0.380859 8.58398 0 8.96484 0 9.50195C0 9.72656 0.0976562 9.98047 0.283203 10.2148L5.35156 16.6699C5.64453 17.0508 5.94727 17.2363 6.36719 17.2363Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const ChevronDown: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 17.3242 / 10.4004;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;

  return (
    <Svg viewBox="0 0 17.3242 10.4004" width={width} height={height} {...props}>
      <G>
        <Rect height="10.4004" opacity={0} width="17.3242" x={0} y={0} />
        <Path
          d="M8.48633 10.4004C8.73047 10.4004 8.97461 10.3027 9.14062 10.1172L16.6992 2.37305C16.8652 2.20703 16.9629 1.99219 16.9629 1.74805C16.9629 1.24023 16.582 0.849609 16.0742 0.849609C15.8301 0.849609 15.6055 0.947266 15.4395 1.10352L7.95898 8.75L9.00391 8.75L1.52344 1.10352C1.36719 0.947266 1.14258 0.849609 0.888672 0.849609C0.380859 0.849609 0 1.24023 0 1.74805C0 1.99219 0.0976562 2.20703 0.263672 2.38281L7.82227 10.1172C8.00781 10.3027 8.23242 10.4004 8.48633 10.4004Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const ChevronLeft: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 12.3926 / 16.9629;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 12.3926 16.9629" width={width} height={height} {...props}>
      <G>
        <Rect height="16.9629" opacity={0} width="12.3926" x={0} y={0} />
        <Path
          d="M0 8.47656C0 8.7207 0.0878906 8.93555 0.273438 9.12109L8.01758 16.6895C8.18359 16.8652 8.39844 16.9531 8.65234 16.9531C9.16016 16.9531 9.55078 16.5723 9.55078 16.0645C9.55078 15.8105 9.44336 15.5957 9.28711 15.4297L2.17773 8.47656L9.28711 1.52344C9.44336 1.35742 9.55078 1.13281 9.55078 0.888672C9.55078 0.380859 9.16016 0 8.65234 0C8.39844 0 8.18359 0.0878906 8.01758 0.253906L0.273438 7.83203C0.0878906 8.00781 0 8.23242 0 8.47656Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const ChevronRight: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 11.6895 / 16.9629;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 11.6895 16.9629" width={width} height={height} {...props}>
      <G>
        <Rect height="16.9629" opacity={0} width="11.6895" x={0} y={0} />
        <Path
          d="M11.6895 8.47656C11.6895 8.23242 11.5918 8.00781 11.4062 7.83203L3.67188 0.253906C3.49609 0.0878906 3.28125 0 3.02734 0C2.5293 0 2.13867 0.380859 2.13867 0.888672C2.13867 1.13281 2.23633 1.35742 2.39258 1.52344L9.50195 8.47656L2.39258 15.4297C2.23633 15.5957 2.13867 15.8105 2.13867 16.0645C2.13867 16.5723 2.5293 16.9531 3.02734 16.9531C3.28125 16.9531 3.49609 16.8652 3.67188 16.6895L11.4062 9.12109C11.5918 8.93555 11.6895 8.7207 11.6895 8.47656Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const ChevronUp: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 17.3242 / 10.3418;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 17.3242 10.3418" width={width} height={height} {...props}>
      <G>
        <Rect height="10.3418" opacity={0} width="17.3242" x={0} y={0} />
        <Path
          d="M0.263672 8.02734C0.0976562 8.18359 0 8.4082 0 8.66211C0 9.16992 0.380859 9.55078 0.888672 9.55078C1.14258 9.55078 1.37695 9.46289 1.52344 9.29688L9.00391 1.66016L7.95898 1.66016L15.4395 9.29688C15.5957 9.46289 15.8301 9.55078 16.0742 9.55078C16.582 9.55078 16.9629 9.16992 16.9629 8.66211C16.9629 8.4082 16.8652 8.18359 16.6992 8.02734L9.14062 0.292969C8.97461 0.107422 8.73047 0 8.48633 0C8.23242 0 7.99805 0.107422 7.82227 0.292969Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const GoogleIconLogo: React.FC<{
  size?: number;
}> = ({ size = 24, ...props }) => {
  return (
    <Svg viewBox="-3 0 262 262" width={size} height={size} {...props}>
      <Path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <Path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <Path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <Path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </Svg>
  );
};

const IconBare: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 24, ...props }) => {
  const aspectRatio = 788 / 296;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg
      viewBox="0 0 788 296"
      width={width}
      height={height}
      fill="none"
      {...props}
    >
      <G clipPath="url(#clip0_24_344)">
        <Path
          d="M330 132C382.255 81.6949 410.134 83.6481 458 132"
          stroke={color}
          strokeWidth="35"
        />
        <Circle cx="205" cy="148" r="130.5" stroke={color} strokeWidth="35" />
        <Path
          d="M27.962 130.5C18.297 130.5 10.462 138.335 10.462 148C10.462 157.665 18.297 165.5 27.962 165.5V130.5ZM86.038 130.5H27.962V165.5H86.038V130.5Z"
          fill={color}
        />
        <Circle
          cx="148"
          cy="148"
          r="130.5"
          transform="matrix(-1 0 0 1 731 0)"
          stroke={color}
          strokeWidth="35"
        />
        <Path
          d="M760.038 130.5C769.703 130.5 777.538 138.335 777.538 148C777.538 157.665 769.703 165.5 760.038 165.5V130.5ZM701.962 130.5H760.038V165.5H701.962V130.5Z"
          fill={color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_24_344">
          <Rect width="788" height="296" rx="130" fill={color} />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

const LineWeight: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 17.0312 / 16.4941;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 17.0312 16.4941" width={width} height={height} {...props}>
      <G>
        <Rect height="16.4941" opacity={0} width="17.0312" x={0} y={0} />
        <Path
          d="M0.507812 1.92383L16.1523 1.92383C16.4648 1.92383 16.6699 1.72852 16.6699 1.41602L16.6699 0.947266C16.6699 0.644531 16.4648 0.449219 16.1523 0.449219L0.507812 0.449219C0.195312 0.449219 0 0.644531 0 0.947266L0 1.41602C0 1.72852 0.195312 1.92383 0.507812 1.92383ZM0.761719 8.11523L15.9082 8.11523C16.377 8.11523 16.6699 7.83203 16.6699 7.36328L16.6699 5.72266C16.6699 5.24414 16.377 4.96094 15.9082 4.96094L0.761719 4.96094C0.283203 4.96094 0 5.24414 0 5.72266L0 7.36328C0 7.83203 0.283203 8.11523 0.761719 8.11523ZM0.761719 16.4941L15.9082 16.4941C16.377 16.4941 16.6699 16.2109 16.6699 15.7324L16.6699 11.8555C16.6699 11.377 16.377 11.0938 15.9082 11.0938L0.761719 11.0938C0.283203 11.0938 0 11.377 0 11.8555L0 15.7324C0 16.2109 0.283203 16.4941 0.761719 16.4941Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const LoudlyCryingFaceSVG: React.FC<{
  size?: number;
}> = ({ size = 24, ...props }) => {
  return (
    <Svg viewBox="0 0 80 80" width={size} height={size} fill="none" {...props}>
      <Path
        opacity={0.75}
        d="M23.6191 65.3335C23.0096 64.9335 22.2286 64.8763 21.581 65.2192C21.581 65.2192 21.581 65.2192 21.562 65.2192C18.6667 66.7049 18.3429 63.0858 15.6763 63.8668C13.2763 64.5716 7.96197 66.362 10.3429 68.0192C12.1524 69.2954 14.2477 67.8858 15.581 68.6668C18.1524 70.1525 18.0001 70.6096 20.1715 69.9049C24.3048 68.5525 23.3905 70.1335 26.362 70.6858C28.5144 71.0858 31.0667 70.362 32.2667 69.143C29.181 68.3239 26.2667 67.0287 23.6191 65.3335Z"
        fill="url(#paint0_linear)"
      />
      <Path
        d="M22.6858 64.7049C22.3238 64.8573 21.9619 65.0287 21.5619 65.2192C18.6667 66.7049 18.4572 63.8668 15.6762 63.8668C13.1048 63.8668 7.96194 66.3621 10.3429 68.0192C12.1524 69.2954 14.2477 67.8859 15.581 68.6668C18.1524 70.1525 18 70.6097 20.1715 69.9049C24.3048 68.5525 23.3905 70.1335 26.3619 70.6859C28.5143 71.0859 31.0667 70.362 32.2667 69.143C28.8 68.2287 25.5619 66.7049 22.6858 64.7049Z"
        fill="url(#paint1_linear)"
      />
      <Path
        d="M40 70.0952C56.8315 70.0952 70.4762 56.4506 70.4762 39.619C70.4762 22.7875 56.8315 9.14285 40 9.14285C23.1685 9.14285 9.5238 22.7875 9.5238 39.619C9.5238 56.4506 23.1685 70.0952 40 70.0952Z"
        fill="url(#paint2_radial)"
      />
      <Path
        opacity={0.5}
        d="M70.4763 39.619C70.4763 56.4571 56.8382 70 40.0001 70.0952C23.2763 70.1714 9.60007 56.5143 9.52388 39.619C9.44769 22.7809 23.162 9.14285 40.0001 9.14285C56.8382 9.14285 70.4763 22.7809 70.4763 39.619Z"
        fill="url(#paint3_radial)"
      />
      <Path
        d="M29.8478 34.3428C30.8573 33.3332 25.543 33.7332 23.124 35.3142C21.8668 36.1332 17.0287 36.7047 19.4668 62.1523C22.1144 64.5904 25.2002 66.5523 28.5716 67.9237C21.1621 50.1523 28.4002 35.7904 29.8478 34.3428Z"
        fill="url(#paint4_linear)"
      />
      <Path
        d="M32.2287 61.3906C35.7525 60.1145 37.543 59.2764 40.0001 59.2764C42.4573 59.2764 44.2668 60.1145 47.7715 61.3906C51.0477 62.5716 52.8763 60.1145 52.5144 56.5335C51.2382 48.9906 45.7525 43.2002 40.0001 43.2002C34.4192 43.2002 29.0858 48.5335 27.6001 55.6954C26.8382 59.7145 28.7049 62.6478 32.2287 61.3906Z"
        fill="url(#paint5_radial)"
      />
      <Path
        d="M51.3525 52.4383C49.1239 46.9906 44.6477 43.2002 40.0001 43.2002C35.3525 43.2002 30.8763 46.9906 28.6477 52.4383C28.7048 52.324 30.1334 49.3525 33.0858 49.9811C36.0953 50.6287 40.0001 50.7049 40.0001 50.7049C40.0001 50.7049 43.8858 50.6097 46.9144 49.9811C49.9429 49.3525 51.3525 52.4383 51.3525 52.4383Z"
        fill="url(#paint6_linear)"
      />
      <Path
        d="M40.0001 48.8571C42.4763 48.8571 44.9525 48.7428 47.4096 48.4952C47.181 48.2286 46.9525 47.9809 46.7049 47.7333C44.6858 45.6952 42.3049 44.5714 40.0001 44.5714C37.6953 44.5714 35.3144 45.6952 33.2953 47.7333C33.0477 47.9809 32.8191 48.2286 32.5906 48.4952C35.0477 48.7428 37.5239 48.8571 40.0001 48.8571Z"
        fill="url(#paint7_radial)"
      />
      <Path
        d="M39.9999 54.4383C36.438 54.4383 31.4095 55.9621 30.2476 60.4954C31.1047 60.2478 32.1142 59.8478 32.8571 59.5621C35.0857 58.7049 37.5999 57.9049 39.980957.9049C42.3619 57.9049 44.8761 58.8764 47.1047 59.7526C47.8476 60.0383 48.8761 60.4383 49.7333 60.6859C48.6095 56.0573 43.5619 54.4383 39.9999 54.4383Z"
        fill="url(#paint8_radial)"
      />
      <Path
        d="M21.2573 25.276C21.3335 26.4951 22.6859 27.1808 24.9525 27.0665C26.8763 26.9522 31.0478 25.657 33.7525 21.7522C34.2478 21.0284 33.4097 20.7046 32.8954 21.1808C31.1811 22.7998 26.4954 25.0284 22.724 24.8189C21.2192 24.7427 21.2573 25.276 21.2573 25.276Z"
        fill="url(#paint9_linear)"
      />
      <Path
        d="M27.9809 30.5905C27.9809 30.5905 33.4857 30.3048 35.6571 33.8667C35.7904 34.0953 35.8857 34.3429 35.9238 34.5905C36 35.1048 35.6 35.6953 34.5523 35.3524C28.0761 33.2 24.7619 34.781 22.2476 35.9238C21.2762 36.3619 20.1904 35.4286 20.5523 34.6286C22.3428 30.5905 27.9809 30.5905 27.9809 30.5905Z"
        fill="url(#paint10_radial)"
      />
      <Path
        d="M27.981 30.5905C27.981 30.5905 33.4858 30.3048 35.6572 33.8667C35.7334 34 35.8096 34.1334 35.8477 34.2857C32.5715 31.5619 28.0762 31.8096 28.0762 31.8096C28.0762 31.8096 23.8858 31.581 20.762 34.2096C22.7429 30.5905 27.981 30.5905 27.981 30.5905Z"
        fill="url(#paint11_linear)"
      />
      <Path
        d="M58.7428 25.276C58.6666 26.4951 57.3142 27.1808 55.0476 27.0665C53.1238 26.9522 48.9523 25.657 46.2476 21.7522C45.7523 21.0284 46.5904 20.7046 47.1047 21.1808C48.819 22.7998 53.5047 25.0284 57.2762 24.8189C58.7809 24.7427 58.7428 25.276 58.7428 25.276Z"
        fill="url(#paint12_linear)"
      />
      <Path
        d="M52.0192 30.5905C52.0192 30.5905 46.5144 30.3048 44.343 33.8667C44.2097 34.0953 44.1144 34.3429 44.0763 34.5905C44.0001 35.1048 44.4001 35.6953 45.4477 35.3524C51.9239 33.2 55.2382 34.781 57.7525 35.9238C58.7239 36.3619 59.8096 35.4286 59.4477 34.6286C57.6573 30.5905 52.0192 30.5905 52.0192 30.5905Z"
        fill="url(#paint13_radial)"
      />
      <Path
        d="M52.019 30.5905C52.019 30.5905 46.5142 30.3048 44.3428 33.8667C44.2666 34 44.1904 34.1334 44.1523 34.2857C47.4285 31.5619 51.9238 31.8096 51.9238 31.8096C51.9238 31.8096 56.1142 31.581 59.238 34.2096C57.2571 30.5905 52.019 30.5905 52.019 30.5905Z"
        fill="url(#paint14_linear)"
      />
      <Path
        d="M17.4668 68.0573C16.0383 35.6763 21.6383 35.524 23.0668 34.7621C25.6002 33.3906 30.0383 32.9144 29.8478 34.343C29.6383 35.943 21.2764 37.4859 24.9906 68.0573"
        fill="url(#paint15_linear)"
      />
      <Path
        opacity={0.75}
        d="M23.6191 65.3332C23.0096 64.9332 22.2286 64.8761 21.581 65.219C21.581 65.219 21.581 65.219 21.562 65.219C18.6667 66.7047 18.4572 63.9047 15.6763 63.8666C13.2953 63.8285 7.96198 66.3618 10.3429 68.019C12.1525 69.2951 14.2477 67.8856 15.581 68.6666C18.1525 70.1523 18.0001 70.6094 20.1715 69.9047C24.3048 68.5523 23.3906 70.1332 26.362 70.6856C28.5144 71.0856 31.0667 70.3618 32.2667 69.1428C29.181 68.3237 26.2667 67.0285 23.6191 65.3332Z"
        fill="url(#paint16_linear)"
      />
      <Path
        opacity={0.65}
        d="M17.4668 68.0573C16.0383 35.6763 21.6383 35.524 23.0668 34.7621C25.6002 33.3906 30.0383 32.9144 29.8478 34.343C29.6383 35.943 21.2764 37.4859 24.9906 68.0573"
        fill="url(#paint17_linear)"
      />
      <Path
        opacity={0.75}
        d="M17.4668 68.0573C16.0383 35.6763 21.6383 35.524 23.0668 34.7621C25.6002 33.3906 30.0383 32.9144 29.8478 34.343C29.6383 35.943 21.2764 37.4859 24.9906 68.0573"
        fill="url(#paint18_linear)"
      />
      <Path
        d="M17.4668 68.0573C16.0383 35.6763 21.6383 35.524 23.0668 34.7621C25.6002 33.3906 30.0383 32.9144 29.8478 34.343C29.6383 35.943 21.2764 37.4859 24.9906 68.0573"
        fill="url(#paint19_linear)"
      />
      <Path
        opacity={0.75}
        d="M56.3811 65.3335C56.9907 64.9335 57.7716 64.8763 58.4192 65.2192C58.4192 65.2192 58.4192 65.2192 58.4383 65.2192C61.3335 66.7049 61.6573 63.0858 64.324 63.8668C66.724 64.5716 72.0383 66.362 69.6573 68.0192C67.8478 69.2954 65.7526 67.8858 64.4192 68.6668C61.8478 70.1525 62.0002 70.6096 59.8288 69.9049C55.6954 68.5525 56.6097 70.1335 53.6383 70.6858C51.4859 71.0858 48.9335 70.362 47.7335 69.143C50.8192 68.3239 53.7335 67.0285 56.3811 65.3335Z"
        fill="url(#paint20_linear)"
      />
      <Path
        d="M57.3145 64.7049C57.6764 64.8573 58.0383 65.0287 58.4383 65.2192C61.3335 66.7049 61.543 63.8668 64.324 63.8668C66.8954 63.8668 72.0383 66.3621 69.6573 68.0192C67.8478 69.2954 65.7526 67.8859 64.4192 68.6668C61.8478 70.1525 62.0002 70.6097 59.8288 69.9049C55.6954 68.5525 56.6097 70.1335 53.6383 70.6859C51.4859 71.0859 48.9335 70.362 47.7335 69.143C51.2002 68.2287 54.4383 66.7049 57.3145 64.7049Z"
        fill="url(#paint21_linear)"
      />
      <Path
        d="M50.1524 34.3428C49.1429 33.3332 54.4571 33.7332 56.8762 35.3142C58.1333 36.1332 62.9714 36.7047 60.5333 62.1523C57.8857 64.5904 54.8 66.5523 51.4286 67.9237C58.8381 50.1523 51.6 35.7904 50.1524 34.3428Z"
        fill="url(#paint22_linear)"
      />
      <Path
        d="M62.5334 68.0573C63.962 35.6763 58.362 35.524 56.9334 34.7621C54.4 33.3906 49.9619 32.9144 50.1524 34.343C50.3619 35.943 58.7239 37.4859 55.0096 68.0573"
        fill="url(#paint23_linear)"
      />
      <Path
        opacity={0.75}
        d="M56.3811 65.3332C56.9907 64.9332 57.7716 64.8761 58.4192 65.219C58.4192 65.219 58.4192 65.219 58.4383 65.219C61.3335 66.7047 61.543 63.9047 64.324 63.8666C66.7049 63.8285 72.0383 66.3618 69.6573 68.019C67.8478 69.2951 65.7526 67.8856 64.4192 68.6666C61.8478 70.1523 62.0002 70.6094 59.8288 69.9047C55.6954 68.5523 56.6097 70.1332 53.6383 70.6856C51.4859 71.0856 48.9335 70.3618 47.7335 69.1428C50.8192 68.3237 53.7335 67.0285 56.3811 65.3332Z"
        fill="url(#paint24_linear)"
      />
      <Path
        opacity={0.65}
        d="M62.5334 68.0573C63.962 35.6763 58.362 35.524 56.9334 34.7621C54.4 33.3906 49.9619 32.9144 50.1524 34.343C50.3619 35.943 58.7239 37.4859 55.0096 68.0573"
        fill="url(#paint25_linear)"
      />
      <Path
        opacity={0.75}
        d="M62.5334 68.0573C63.962 35.6763 58.362 35.524 56.9334 34.7621C54.4 33.3906 49.9619 32.9144 50.1524 34.343C50.3619 35.943 58.7239 37.4859 55.0096 68.0573"
        fill="url(#paint26_linear)"
      />
      <Path
        d="M62.5334 68.0573C63.962 35.6763 58.362 35.524 56.9334 34.7621C54.4 33.3906 49.9619 32.9144 50.1524 34.343C50.3619 35.943 58.7239 37.4859 55.0096 68.0573"
        fill="url(#paint27_linear)"
      />
      <Path
        opacity={0.5}
        d="M70.4763 39.619C70.4763 56.4571 56.8382 70 40.0001 70.0952C23.2763 70.1714 9.60007 56.5143 9.52388 39.619C9.44769 22.7809 23.162 9.14285 40.0001 9.14285C56.8382 9.14285 70.4763 22.7809 70.4763 39.619Z"
        fill="url(#paint28_radial)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear"
          x1="28.3562"
          y1="67.3462"
          x2="19.0593"
          y2="67.2314"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3640FF" stopOpacity="0.5" />
          <Stop offset="0.0308253" stopColor="#3444FD" stopOpacity="0.4846" />
          <Stop offset="0.469" stopColor="#1872E8" stopOpacity="0.2655" />
          <Stop offset="0.8064" stopColor="#068EDB" stopOpacity="0.0968231" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear"
          x1="20.4547"
          y1="62.9899"
          x2="20.9743"
          y2="67.7864"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B0E9FF" />
          <Stop offset="0.2885" stopColor="#7BD9FF" />
          <Stop offset="0.6184" stopColor="#45C9FE" />
          <Stop offset="0.8656" stopColor="#24BFFE" />
          <Stop offset="1" stopColor="#17BBFE" />
        </LinearGradient>
        <RadialGradient
          id="paint2_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(34.0041 27.2681) scale(36.7656)"
        >
          <Stop stopColor="#FFE030" />
          <Stop offset="1" stopColor="#FFB92E" />
        </RadialGradient>
        <RadialGradient
          id="paint3_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(34.004 27.2682) scale(28.9253)"
        >
          <Stop stopColor="#FFEA5F" />
          <Stop offset="1" stopColor="#FFBC47" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient
          id="paint4_linear"
          x1="37.1109"
          y1="51.1764"
          x2="10.2627"
          y2="50.0923"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF9D00" stopOpacity="0" />
          <Stop offset="1" stopColor="#FF8000" />
        </LinearGradient>
        <RadialGradient
          id="paint5_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(38.9436 52.6177) scale(8.11933)"
        >
          <Stop offset="0.00132565" stopColor="#7A4400" />
          <Stop offset="1" stopColor="#643800" />
        </RadialGradient>
        <LinearGradient
          id="paint6_linear"
          x1="28.6524"
          y1="47.8135"
          x2="51.3505"
          y2="47.8135"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.00132565" stopColor="#3C2200" />
          <Stop offset="1" stopColor="#512D00" />
        </LinearGradient>
        <RadialGradient
          id="paint7_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(39.7663 47.1324) scale(8.01677)"
        >
          <Stop offset="0.00132565" stopColor="white" />
          <Stop offset="1" stopColor="#A9BCBE" />
        </RadialGradient>
        <RadialGradient
          id="paint8_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(40.0034 56.9124) scale(8.66262 2.2083)"
        >
          <Stop stopColor="#FF0000" />
          <Stop offset="1" stopColor="#C20000" />
        </RadialGradient>
        <LinearGradient
          id="paint9_linear"
          x1="27.708"
          y1="28.5917"
          x2="27.6128"
          y2="24.433"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.00132565" stopColor="#3C2200" />
          <Stop offset="1" stopColor="#7A4400" />
        </LinearGradient>
        <RadialGradient
          id="paint10_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(28.0807 33.1894) rotate(-2.88189) scale(5.89127 2.6178)"
        >
          <Stop offset="0.00132565" stopColor="#7A4400" />
          <Stop offset="1" stopColor="#643800" />
        </RadialGradient>
        <LinearGradient
          id="paint11_linear"
          x1="28.301"
          y1="26.696"
          x2="28.301"
          y2="34.3619"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.00132565" stopColor="#3C2200" />
          <Stop offset="1" stopColor="#512D00" />
        </LinearGradient>
        <LinearGradient
          id="paint12_linear"
          x1="52.2924"
          y1="28.5917"
          x2="52.3877"
          y2="24.433"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.00132565" stopColor="#3C2200" />
          <Stop offset="1" stopColor="#7A4400" />
        </LinearGradient>
        <RadialGradient
          id="paint13_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(51.9149 33.1896) rotate(-177.118) scale(5.89127 2.6178)"
        >
          <Stop offset="0.00132565" stopColor="#7A4400" />
          <Stop offset="1" stopColor="#643800" />
        </RadialGradient>
        <LinearGradient
          id="paint14_linear"
          x1="51.6993"
          y1="26.696"
          x2="51.6993"
          y2="34.3619"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0.00132565" stopColor="#3C2200" />
          <Stop offset="1" stopColor="#512D00" />
        </LinearGradient>
        <LinearGradient
          id="paint15_linear"
          x1="21.0471"
          y1="22.2877"
          x2="25.4384"
          y2="70.712"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B0E9FF" />
          <Stop offset="0.3331" stopColor="#B0E9FF" />
          <Stop offset="0.4126" stopColor="#7BD9FF" />
          <Stop offset="0.5034" stopColor="#45C9FE" />
          <Stop offset="0.5715" stopColor="#24BFFE" />
          <Stop offset="0.6085" stopColor="#17BBFE" />
          <Stop offset="0.8891" stopColor="#17BBFE" />
        </LinearGradient>
        <LinearGradient
          id="paint16_linear"
          x1="25.2971"
          y1="69.6378"
          x2="17.2018"
          y2="66.7807"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3640FF" stopOpacity="0.5" />
          <Stop offset="0.0308253" stopColor="#3444FD" stopOpacity="0.4846" />
          <Stop offset="0.469" stopColor="#1872E8" stopOpacity="0.2655" />
          <Stop offset="0.8064" stopColor="#068EDB" stopOpacity="0.0968231" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint17_linear"
          x1="25.3923"
          y1="37.2672"
          x2="21.8368"
          y2="54.664"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="0.5" stopColor="white" stopOpacity="0.5" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint18_linear"
          x1="24.0965"
          y1="57.782"
          x2="24.6679"
          y2="66.5439"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="0.5" stopColor="white" stopOpacity="0.5" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint19_linear"
          x1="23.5479"
          y1="62.0209"
          x2="23.5479"
          y2="31.2907"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#17BBFE" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#0099D6" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint20_linear"
          x1="51.6448"
          y1="67.3463"
          x2="60.9416"
          y2="67.2315"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3640FF" stopOpacity="0.5" />
          <Stop offset="0.0308253" stopColor="#3444FD" stopOpacity="0.4846" />
          <Stop offset="0.469" stopColor="#1872E8" stopOpacity="0.2655" />
          <Stop offset="0.8064" stopColor="#068EDB" stopOpacity="0.0968231" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint21_linear"
          x1="59.5463"
          y1="62.99"
          x2="59.0266"
          y2="67.7864"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B0E9FF" />
          <Stop offset="0.2885" stopColor="#7BD9FF" />
          <Stop offset="0.6184" stopColor="#45C9FE" />
          <Stop offset="0.8656" stopColor="#24BFFE" />
          <Stop offset="1" stopColor="#17BBFE" />
        </LinearGradient>
        <LinearGradient
          id="paint22_linear"
          x1="42.89"
          y1="51.1765"
          x2="69.7381"
          y2="50.0923"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF9D00" stopOpacity="0" />
          <Stop offset="1" stopColor="#FF8000" />
        </LinearGradient>
        <LinearGradient
          id="paint23_linear"
          x1="58.9538"
          y1="22.2878"
          x2="54.5626"
          y2="70.712"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B0E9FF" />
          <Stop offset="0.3331" stopColor="#B0E9FF" />
          <Stop offset="0.4126" stopColor="#7BD9FF" />
          <Stop offset="0.5034" stopColor="#45C9FE" />
          <Stop offset="0.5715" stopColor="#24BFFE" />
          <Stop offset="0.6085" stopColor="#17BBFE" />
          <Stop offset="0.8891" stopColor="#17BBFE" />
        </LinearGradient>
        <LinearGradient
          id="paint24_linear"
          x1="54.7039"
          y1="69.6378"
          x2="62.7991"
          y2="66.7807"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3640FF" stopOpacity="0.5" />
          <Stop offset="0.0308253" stopColor="#3444FD" stopOpacity="0.4846" />
          <Stop offset="0.469" stopColor="#1872E8" stopOpacity="0.2655" />
          <Stop offset="0.8064" stopColor="#068EDB" stopOpacity="0.0968231" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint25_linear"
          x1="54.6086"
          y1="37.2672"
          x2="58.1642"
          y2="54.6641"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="0.5" stopColor="white" stopOpacity="0.5" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint26_linear"
          x1="55.9045"
          y1="57.782"
          x2="55.333"
          y2="66.5439"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0" />
          <Stop offset="0.5" stopColor="white" stopOpacity="0.5" />
          <Stop offset="1" stopColor="white" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient
          id="paint27_linear"
          x1="56.453"
          y1="62.0209"
          x2="56.453"
          y2="31.2908"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#17BBFE" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#0099D6" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#0099D6" stopOpacity="0" />
        </LinearGradient>
        <RadialGradient
          id="paint28_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(40.2625 64.4562) rotate(-90) scale(4.06349 12.6955)"
        >
          <Stop stopColor="#A3541E" stopOpacity="0.5" />
          <Stop offset="0.283" stopColor="#B26126" stopOpacity="0.3578" />
          <Stop offset="0.8286" stopColor="#DA843C" stopOpacity="0.0836319" />
          <Stop offset="0.995" stopColor="#E89043" stopOpacity="0" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
};

const Pause: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "white", size = 18, ...props }) => {
  const aspectRatio = 12.2754 / 16.1621;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 12.2754 16.1621" width={width} height={height} {...props}>
      <G>
        <Rect height="16.1621" opacity={0} width="12.2754" x={0} y={0} />
        <Path
          d="M1.29883 16.1523L3.52539 16.1523C4.375 16.1523 4.82422 15.7031 4.82422 14.8438L4.82422 1.29883C4.82422 0.400391 4.375 0 3.52539 0L1.29883 0C0.449219 0 0 0.439453 0 1.29883L0 14.8438C0 15.7031 0.449219 16.1523 1.29883 16.1523ZM8.39844 16.1523L10.6152 16.1523C11.4746 16.1523 11.9141 15.7031 11.9141 14.8438L11.9141 1.29883C11.9141 0.400391 11.4746 0 10.6152 0L8.39844 0C7.53906 0 7.08984 0.439453 7.08984 1.29883L7.08984 14.8438C7.08984 15.7031 7.53906 16.1523 8.39844 16.1523Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const PersonCropCircleFill: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "black", size = 20, ...props }) => {
  const aspectRatio = 20.2832 / 19.9316;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 20.2832 19.9316" width={width} height={height} {...props}>
      <G>
        <Rect height="19.9316" opacity={0} width="20.2832" x={0} y={0} />
        <Path
          d="M19.9219 9.96094C19.9219 15.4492 15.459 19.9219 9.96094 19.9219C4.47266 19.9219 0 15.4492 0 9.96094C0 4.46289 4.47266 0 9.96094 0C15.459 0 19.9219 4.46289 19.9219 9.96094ZM3.95508 15.9277C5.44922 17.5195 7.71484 18.4375 9.95117 18.4375C12.1973 18.4375 14.4531 17.5195 15.957 15.9277C14.8926 14.248 12.5781 13.291 9.95117 13.291C7.30469 13.291 5.00977 14.2676 3.95508 15.9277ZM6.60156 7.94922C6.60156 10.0488 8.07617 11.6113 9.95117 11.6309C11.8359 11.6504 13.3008 10.0488 13.3008 7.94922C13.3008 5.97656 11.8262 4.33594 9.95117 4.33594C8.08594 4.33594 6.5918 5.97656 6.60156 7.94922Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const PlayFill: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 16.2891 / 16.416;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 16.2891 16.416" width={width} height={height} {...props}>
      <G>
        <Rect height="16.416" opacity={0} width="16.2891" x={0} y={0} />
        <Path
          d="M1.70898 14.9805C1.70898 15.9473 2.26562 16.4062 2.92969 16.4062C3.22266 16.4062 3.52539 16.3086 3.82812 16.1523L15.2051 9.50195C16.0156 9.0332 16.2891 8.71094 16.2891 8.20312C16.2891 7.68555 16.0156 7.37305 15.2051 6.9043L3.82812 0.253906C3.52539 0.0878906 3.22266 0 2.92969 0C2.26562 0 1.70898 0.458984 1.70898 1.42578Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const Safari: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 20, ...props }) => {
  const aspectRatio = 20.2832 / 19.9316;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 20.2832 19.9316" width={width} height={height} {...props}>
      <G>
        <Rect height="19.9316" opacity={0} width="20.2832" x={0} y={0} />
        <Path
          d="M9.96094 19.9219C15.459 19.9219 19.9219 15.459 19.9219 9.96094C19.9219 4.46289 15.459 0 9.96094 0C4.46289 0 0 4.46289 0 9.96094C0 15.459 4.46289 19.9219 9.96094 19.9219ZM9.96094 18.2617C5.37109 18.2617 1.66016 14.5508 1.66016 9.96094C1.66016 5.37109 5.37109 1.66016 9.96094 1.66016C14.5508 1.66016 18.2617 5.37109 18.2617 9.96094C18.2617 14.5508 14.5508 18.2617 9.96094 18.2617Z"
          fill={color}
          fillOpacity={0.85}
        />
        <Path
          d="M5.86914 14.8828L11.4746 12.1484C11.7871 11.9922 12.002 11.7773 12.1582 11.4746L14.8828 5.87891C15.1953 5.21484 14.7168 4.69727 14.0332 5.03906L8.44727 7.76367C8.14453 7.90039 7.93945 8.10547 7.77344 8.4375L5.0293 14.043C4.7168 14.6875 5.22461 15.1953 5.86914 14.8828ZM9.96094 11.1621C9.29688 11.1621 8.76953 10.625 8.76953 9.9707C8.76953 9.30664 9.29688 8.76953 9.96094 8.76953C10.625 8.76953 11.1621 9.30664 11.1621 9.9707C11.1621 10.625 10.625 11.1621 9.96094 11.1621Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const Spinner: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 20, ...props }) => {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size} {...props}>
      <Path
        d="m10 3.5c-3.58985 0-6.5 2.91015-6.5 6.5 0 .4142-.33579.75-.75.75s-.75-.3358-.75-.75c0-4.41828 3.58172-8 8-8 4.4183 0 8 3.58172 8 8 0 4.4183-3.5817 8-8 8-.41421 0-.75-.3358-.75-.75s.33579-.75.75-.75c3.5899 0 6.5-2.9101 6.5-6.5 0-3.58985-2.9101-6.5-6.5-6.5z"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
    </Svg>
  );
};

const SquareAndPencil: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "black", size = 24, ...props }) => {
  const aspectRatio = 23.6475 / 23.3041;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 23.6475 23.3041" width={width} height={height} {...props}>
      <G>
        <Rect height="23.3041" opacity={0} width="23.6475" x={0} y={0} />
        <Path
          d="M15.5591 4.88935L6.08643 4.88935C5.10986 4.88935 4.56299 5.41669 4.56299 6.43232L4.56299 17.5163C4.56299 18.5319 5.10986 19.0495 6.08643 19.0495L17.2095 19.0495C18.186 19.0495 18.7231 18.5319 18.7231 17.5163L18.7231 8.12957L20.2954 6.55445L20.2954 17.5944C20.2954 19.6159 19.27 20.6218 17.229 20.6218L6.05713 20.6218C4.02588 20.6218 2.99072 19.6159 2.99072 17.5944L2.99072 6.34443C2.99072 4.33271 4.02588 3.31708 6.05713 3.31708L17.1313 3.31708Z"
          fill={color}
          fillOpacity={0.85}
        />
        <Path
          d="M9.61182 14.2936L11.5161 13.4636L20.6372 4.35224L19.2993 3.03388L10.188 12.1452L9.30908 13.9811C9.23096 14.1472 9.42627 14.3718 9.61182 14.2936ZM21.3599 3.63935L22.063 2.91669C22.395 2.56513 22.395 2.09638 22.063 1.77412L21.8384 1.53974C21.5356 1.23701 21.0571 1.27607 20.7349 1.58857L20.022 2.29169Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const TextBadgePlus: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 20, ...props }) => {
  const aspectRatio = 20.0391 / 20.0293;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 20.0391 20.0293" width={width} height={height} {...props}>
      <G>
        <Rect height="20.0293" opacity={0} width="20.0391" x={0} y={0} />
        <Path
          d="M19.6777 17.6562C19.6777 18.0664 19.3359 18.3887 18.9258 18.3887L0.732422 18.3887C0.322266 18.3887 0 18.0664 0 17.6562C0 17.2461 0.322266 16.9141 0.732422 16.9141L18.9258 16.9141C19.3359 16.9141 19.6777 17.2461 19.6777 17.6562ZM19.6777 12.5391C19.6777 12.9492 19.3359 13.2812 18.9258 13.2812L0.732422 13.2812C0.322266 13.2812 0 12.9492 0 12.5391C0 12.1289 0.322266 11.8066 0.732422 11.8066L18.9258 11.8066C19.3359 11.8066 19.6777 12.1289 19.6777 12.5391ZM19.6777 7.42188C19.6777 7.8418 19.3359 8.16406 18.9258 8.16406L12.2461 8.16406C11.8359 8.16406 11.5137 7.8418 11.5137 7.42188C11.5137 7.01172 11.8359 6.68945 12.2461 6.68945L18.9258 6.68945C19.3359 6.68945 19.6777 7.01172 19.6777 7.42188ZM19.6777 2.30469C19.6777 2.72461 19.3359 3.04688 18.9258 3.04688L12.2461 3.04688C11.8359 3.04688 11.5137 2.72461 11.5137 2.30469C11.5137 1.89453 11.8359 1.57227 12.2461 1.57227L18.9258 1.57227C19.3359 1.57227 19.6777 1.89453 19.6777 2.30469Z"
          fill={color}
          fillOpacity={0.85}
        />
        <Path
          d="M9.93164 4.96094C9.93164 7.67578 7.65625 9.93164 4.9707 9.93164C2.24609 9.93164 0.00976562 7.69531 0.00976562 4.96094C0.00976562 2.24609 2.24609 0 4.9707 0C7.68555 0 9.93164 2.24609 9.93164 4.96094ZM4.36523 2.46094L4.36523 4.36523L2.46094 4.36523C2.09961 4.36523 1.86523 4.59961 1.86523 4.96094C1.86523 5.33203 2.09961 5.56641 2.46094 5.56641L4.36523 5.56641L4.36523 7.4707C4.36523 7.83203 4.59961 8.07617 4.9707 8.07617C5.33203 8.07617 5.56641 7.83203 5.56641 7.4707L5.56641 5.56641L7.4707 5.56641C7.83203 5.56641 8.07617 5.33203 8.07617 4.96094C8.07617 4.59961 7.83203 4.36523 7.4707 4.36523L5.56641 4.36523L5.56641 2.46094C5.56641 2.09961 5.33203 1.86523 4.9707 1.86523C4.59961 1.86523 4.36523 2.09961 4.36523 2.46094Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const Xmark: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = "currentColor", size = 18, ...props }) => {
  const aspectRatio = 15.8472 / 15.4956;
  const width = typeof size === "number" ? size * aspectRatio : size;
  const height = typeof size === "number" ? size : undefined;
  return (
    <Svg viewBox="0 0 15.8472 15.4956" width={width} height={height} {...props}>
      <G>
        <Rect height="15.4956" opacity={0} width="15.8472" x={0} y={0} />
        <Path
          d="M0.252699 15.2429C0.594496 15.575 1.1609 15.575 1.49293 15.2429L7.74293 8.99293L13.9929 15.2429C14.325 15.575 14.9011 15.5847 15.2332 15.2429C15.5652 14.9011 15.5652 14.3445 15.2332 14.0125L8.98317 7.7527L15.2332 1.5027C15.5652 1.17067 15.575 0.604261 15.2332 0.27223C14.8914-0.0695668 14.325-0.0695668 13.9929 0.27223L7.74293 6.52223L1.49293 0.27223C1.1609-0.0695668 0.58473-0.0793324 0.252699 0.27223C-0.0793324 0.614027-0.0793324 1.17067 0.252699 1.5027L6.5027 7.7527L0.252699 14.0125C-0.0793324 14.3445-0.0890981 14.9109 0.252699 15.2429Z"
          fill={color}
          fillOpacity={0.85}
        />
      </G>
    </Svg>
  );
};

const Icons = {
  ArrowTriangleHeadClockwise,
  LineWeight,
  PersonCropCircleFill,
  SquareAndPencil,
  Bars3,
  ArrowArcLeft,
  ArrowArcRight,
  Pause,
  ArrowDown,
  Tada,
  LoudlyCryingFace,
  LoudlyCryingFaceSVG,
  ArrowUTurnLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  PlayFill,
  IconBare,
  TextBadgePlus,
  Checkmark,
  Safari,
  GoogleIconLogo,
  Xmark,
  Spinner,
};

export default Icons;

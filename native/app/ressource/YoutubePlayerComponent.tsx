import Icons from "@/components/icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, View } from "react-native";
import YoutubePlayer, { PLAYER_STATES } from "react-native-youtube-iframe";

export function YoutubePlayerComponent({
  videoId,
  disableAutoPlay,
}: {
  videoId: string;
  disableAutoPlay?: boolean;
}) {
  const [playing, setPlaying] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const height = useRef((Dimensions.get("window").width / 16) * 9).current;

  const loaderAnimationScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(loaderAnimationScale, {
          toValue: 1.3,
          useNativeDriver: true,
        }),
        Animated.timing(loaderAnimationScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onStateChange = (state: PLAYER_STATES) => {
    if (state === "ended") {
      setPlaying(false);
    } else if (state === "paused") {
      setPlaying(false);
    } else if (state === "playing") {
      setPlaying(true);
    }
  };

  const handlePlayerReady = () => {
    setLoading(false);

    if (!disableAutoPlay) {
      setPlaying(true);
    }
  };

  return (
    <View className="bg-black">
      <YoutubePlayer
        height={height}
        play={playing}
        videoId={videoId}
        onChangeState={onStateChange}
        onReady={handlePlayerReady}
      />

      {loading && (
        <Animated.View
          className="absolute top-0 bottom-0 left-0 right-0 flex flex-row items-center justify-center"
          style={{
            transform: [
              {
                scale: loaderAnimationScale,
              },
            ],
          }}
        >
          <Icons.IconBare width={70} height={70} color="white" />
        </Animated.View>
      )}
    </View>
  );
}

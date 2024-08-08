import { YoutubePlayerComponent } from "@/app/ressource/[id]/YoutubePlayerComponent";
import CircularProgressView from "@/components/CircularProgress";
import { ExternalLink } from "@/components/ExternalLink";
import Icons from "@/components/Icons";
import { MyModal } from "@/components/MyModal";
import { Spinner } from "@/components/Spinner";
import { useAPI } from "@/lib/api/apiProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ResourceBlock, ResourceWithCardsAndMemory } from "youwise-shared/api";
import { IsMemoryParamsLearned } from "../../../lib/fsrsWrapper";

// Entry point for the app
const ResourcePage = () => {
  const { id } = useLocalSearchParams();
  if (typeof id !== "string") throw new Error("Invalid url");

  const insets = useSafeAreaInsets();
  const api = useAPI();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<ResourceWithCardsAndMemory>();

  const onRefresh = () => {
    setLoading(true);

    if (!api.userStored) {
      setResource(undefined);
    } else {
      api.resources.get({ id: id }).then((res) => {
        if (res.error !== undefined) {
          console.log(res.error);
          router.back();
          return;
        }

        setResource(res);
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    onRefresh();
  }, [api.userStored]);

  const [learnedModalOpen, setLearnedModalOpen] = useState(false);

  if (resource === undefined || loading) {
    return (
      <SafeAreaView>
        <Spinner size={32} />
      </SafeAreaView>
    );
  }

  const resourceHasCards = resource.cards.length > 0;

  const cardsCount = resource.cards.length;
  const cardsLearnedCount = resource.cards.reduce((acc, card) => {
    return IsMemoryParamsLearned(card.memory?.memoryParams || null)
      ? acc + 1
      : acc;
  }, 0);
  const learningProgress =
    cardsCount === 0 ? 0 : cardsLearnedCount / cardsCount;
  const isRessourceLearned = cardsLearnedCount === cardsCount;

  const ressourceBlocks: ResourceBlock[] = resource.content
    .split("\n")
    .map((line) => ({
      type: "paragraph",
      content: line,
    })); // TODO:

  return (
    <View className="bg-white min-h-full">
      <MyModal open={learnedModalOpen}>
        <View className="flex flex-col gap-4">
          <View className="flex flex-row items-center gap-2">
            <Icons.Checkmark width={16} height={16} color="black" />

            <Text className="font-[Avenir] text-2xl font-bold">Learned</Text>
          </View>

          <Text className="font-[Avenir] text-lg">
            You will be quized on this ressource in your next ReWise.
          </Text>

          <TouchableOpacity onPress={() => setLearnedModalOpen(false)}>
            <View className="bg-red-100 border-2 border-red-600 px-4 py-2 rounded-full flex flex-row items-center justify-center gap-2">
              <Text className="text-red-800 font-[Avenir] font-bold">
                <Text className="font-[GillSans]">ReWise now</Text>
              </Text>

              <Icons.PlayFill width={12} height={12} color="#991b1b" />
            </View>
          </TouchableOpacity>
        </View>
      </MyModal>

      <View
        className="flex flex-row py-3 px-3 justify-between items-center"
        style={{
          marginTop: insets.top,
        }}
      >
        <View>
          <TouchableOpacity onPress={() => router.back()}>
            <View className="flex flex-row gap-2 items-center">
              <Icons.ChevronLeft width={20} height={20} color="black" />

              <Text className="font-[Avenir] text-lg font-medium">Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        {resourceHasCards ? (
          <View className="flex flex-row items-center gap-4 text-gray-600">
            {isRessourceLearned ? (
              <View className="flex flex-row justify-center items-center">
                <TouchableOpacity
                  className="border-2 border-black px-4 py-2 rounded-full flex flex-row items-center gap-2"
                  onPress={() => setLearnedModalOpen(true)}
                >
                  <Text className="text-black font-[Avenir] font-bold">
                    <Text className="font-[GillSans]">Learned</Text>
                  </Text>

                  <Icons.Checkmark width={12} height={12} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex flex-row justify-center items-center gap-2">
                <TouchableOpacity
                  className="bg-red-100 border-2 border-red-600  px-4 py-2 rounded-full flex flex-row items-center gap-2"
                  onPress={() =>
                    router.push({
                      pathname: "/revision/[resourceId]",
                      params: { resourceId: id },
                    })
                  }
                >
                  <Text className="text-red-800 font-bold font-[GillSans]">
                    ReWise
                  </Text>

                  <Icons.PlayFill width={12} height={12} color="#991b1b" />
                </TouchableOpacity>

                <View className="flex flex-col items-center justify-center gap-[2px] mt-1">
                  <CircularProgressView
                    progress={learningProgress}
                    backgroundColor="#fecaca" // red-200
                    doneColor="#991b1b"
                    size={12}
                  />

                  <Text className="text-red-800 font-bold text-xs font-[GillSans]">
                    {Math.ceil(learningProgress * 100)}%
                  </Text>
                </View>
              </View>
            )}
          </View>
        ) : null}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        {resource.originalUrl ? (
          <View className="px-4 mt-3">
            <ExternalLink href={resource.originalUrl}>
              <View className="flex flex-row gap-1 items-center">
                <Text className="font-[AmericanTypewriter] text-sm ">
                  Original page
                </Text>

                <Icons.ChevronRight width={6} height={6} color="black" />
              </View>
            </ExternalLink>
          </View>
        ) : null}

        <View className="px-4 mt-3 mb-3">
          <Text className="font-[AmericanTypewriter-Bold] text-5xl font-bold">
            {resource.name}
          </Text>
        </View>

        <View className="flex flex-col gap-2">
          {ressourceBlocks.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <View className="px-4 mt-4" key={index}>
                  <Text className="font-[AmericanTypewriter] font-medium text-lg">
                    {block.content}
                  </Text>
                </View>
              );
            } else if (block.type === "youtube") {
              return (
                <View key={index}>
                  <YoutubePlayerComponent
                    videoId={block.youtubeId}
                    disableAutoPlay
                  />

                  <View className="px-4">
                    <Text className="font-[AmericanTypewriter] text-xl font-bold font mt-6">
                      Description
                    </Text>

                    <Text className="font-[AmericanTypewriter] text-lg mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam vehicula, urna nec ultrices fermentum, nisi nisl
                      consectetur mi, ac tincidunt ante magna sit amet magna.
                      Nullam vehicula, urna nec ultrices fermentum, nisi nisl
                      consectetur mi, ac tincidunt ante magna sit amet magna.
                    </Text>
                  </View>
                </View>
              );
            } else if (block.type === "title") {
              const titleSize = (() => {
                switch (block.level) {
                  case 1:
                    return "text-3xl";
                  case 2:
                    return "text-2xl";
                  case 3:
                    return "text-xl";
                }
              })();

              return (
                <View className="px-4 mt-4" key={index}>
                  <Text
                    className={`font-[AmericanTypewriter] font-bold ${titleSize}`}
                  >
                    {block.content}
                  </Text>
                </View>
              );
            } else if (block.type === "image") {
              return (
                <View className="px-4 my-4" key={index}>
                  <Image source={{ uri: block.source }} />
                </View>
              );
            }
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ResourcePage;

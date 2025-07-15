import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomepageHeader } from "@/components/homepage/header";
import {
  HorizontalResourcesList,
  HorizontalResourcesListItem,
} from "@/components/homepage/horizontal-resources-list";
import {
  getRewiseButtonBottomInset,
  RewiseButton,
} from "@/components/homepage/rewise-button";
import {
  VerticalResourcesList,
  VerticalResourcesListItem,
} from "@/components/homepage/vertical-resource-list";
import { useTrpc } from "@/components/providers/TrpcProvider";
import { useQuery } from "@tanstack/react-query";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const trpc = useTrpc();

  const { data, isLoading, refetch } = useQuery(
    trpc.my.getHomepage.queryOptions()
  );

  return (
    <View className="flex-1 bg-white">
      <HomepageHeader />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        <View
          style={{
            paddingBottom: getRewiseButtonBottomInset(insets),
          }}
        >
          <HorizontalResourcesList title="Library">
            {data?.resources.map((resource, i) => (
              <HorizontalResourcesListItem key={i} resource={resource} />
            ))}
          </HorizontalResourcesList>

          <VerticalResourcesList title="Recommended for you">
            {data?.resources.map((resource, i) => (
              <VerticalResourcesListItem key={i} resource={resource} />
            ))}
          </VerticalResourcesList>
        </View>
      </ScrollView>

      <RewiseButton href="/revision" />
    </View>
  );
};

// Entry point for the app
const App = () => {
  return <HomeScreen />;
};

export default App;

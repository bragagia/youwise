import RevisionComponent from "@/components/revision/RevisionComponent";
import { Spinner } from "@/components/Spinner";
import { RevisingMemory } from "@/lib/revision/memoryBeingRevised";
import { createRevisionDeckFromResource } from "@/lib/revision/useLocalRevisionEngine";
import { mockResourceDemo } from "@/lib/types/MOCK";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

const RevisionOfResourcePage = () => {
  const { resourceId } = useLocalSearchParams();
  if (typeof resourceId !== "string") throw new Error("Invalid url");

  const [loading, setLoading] = useState(true);
  const [revisionDeck, setRevisionDeck] = useState<RevisingMemory[]>();

  useEffect(() => {
    setLoading(true);

    //  api.resources.get

    const ressources = mockResourceDemo;

    const { revisionDeck } = createRevisionDeckFromResource(ressources);
    setRevisionDeck(revisionDeck);

    setLoading(false);
  }, [resourceId]);

  if (loading || !revisionDeck) {
    return (
      <SafeAreaView>
        <Spinner size={32} />
      </SafeAreaView>
    );
  }

  return <RevisionComponent revisionDeck={revisionDeck} />;
};

export default RevisionOfResourcePage;

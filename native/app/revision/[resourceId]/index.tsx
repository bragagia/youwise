import { MemoryBeingRevised } from "@/app/revision/MemoryBeingRevised";
import RevisionComponent from "@/app/revision/RevisionComponent";
import { createRevisionDeckFromResource } from "@/app/revision/useLocalRevisionEngine";
import { Spinner } from "@/components/Spinner";
import { useAPI } from "@/lib/api/apiProvider";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

const RevisionOfResourcePage = () => {
  const { resourceId } = useLocalSearchParams();
  if (typeof resourceId !== "string") throw new Error("Invalid url");

  const api = useAPI();

  const [loading, setLoading] = useState(true);
  const [revisionDeck, setRevisionDeck] = useState<MemoryBeingRevised[]>();

  useEffect(() => {
    setLoading(true);

    if (!api.userStored) {
      setRevisionDeck(undefined);
    } else {
      api.resources.get({ id: resourceId }).then((res) => {
        if (res.error !== undefined) {
          console.log(res.error);
          return;
        }

        setRevisionDeck(createRevisionDeckFromResource(res));
      });
    }

    setLoading(false);
  }, [api.userStored, resourceId]);

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

import { RevisingMemory } from "@/app/revision/MemoryBeingRevised";
import RevisionComponent from "@/app/revision/RevisionComponent";
import { createRevisionDeckFromResource } from "@/app/revision/useLocalRevisionEngine";
import { Spinner } from "@/components/Spinner";
import { useAPI } from "@/lib/api/apiProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

const RevisionOfResourcePage = () => {
  const { resourceId } = useLocalSearchParams();
  if (typeof resourceId !== "string") throw new Error("Invalid url");

  const api = useAPI();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [revisionDeck, setRevisionDeck] = useState<RevisingMemory[]>();

  useEffect(() => {
    setLoading(true);

    if (!api.userStored) {
      setRevisionDeck(undefined);
    } else {
      api.resources.get({ id: resourceId }).then(async (res) => {
        if (res.error !== undefined) {
          console.log(res.error);
          router.back();
          return;
        }

        setRevisionDeck(await createRevisionDeckFromResource(api, res));
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

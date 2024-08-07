import { RevisingMemory } from "@/app/revision/MemoryBeingRevised";
import RevisionComponent from "@/app/revision/RevisionComponent";
import { createRevisionDeckFromCards } from "@/app/revision/useLocalRevisionEngine";
import { Spinner } from "@/components/Spinner";
import { useAPI } from "@/lib/api/apiProvider";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

const RevisionPage = () => {
  const api = useAPI();
  const router = useRouter();

  const [revisionDeck, setRevisionDeck] = useState<RevisingMemory[]>();

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    api.dailyRevisions
      .generate({
        date: currentDate,
      })
      .then((res) => {
        if (res.error !== undefined) {
          console.log(res);
          router.back();
          return;
        }

        createRevisionDeckFromCards(api, res.cards).then(
          ({ error, revisionDeck }) => {
            if (error) {
              console.log("Error while creating revision deck", error);
              return;
            }

            setRevisionDeck(revisionDeck);
          }
        );

        console.log(res);
      });
  }, []);

  if (!revisionDeck) {
    return (
      <SafeAreaView>
        <Spinner size={32} />
      </SafeAreaView>
    );
  }

  return <RevisionComponent revisionDeck={revisionDeck} />;
};

export default RevisionPage;

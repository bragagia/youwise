import RevisionComponent from "@/components/revision/RevisionComponent";
import { Spinner } from "@/components/Spinner";
import { RevisingMemory } from "@/lib/revision/memoryBeingRevised";
import { createRevisionDeckFromCards } from "@/lib/revision/useLocalRevisionEngine";
import { mockResourceDemo } from "@/lib/types/MOCK";
//import { useAPI } from "@/lib/api/apiProvider";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

const RevisionPage = () => {
  const [revisionDeck, setRevisionDeck] = useState<RevisingMemory[]>();

  // useEffect(() => {
  //   const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  //   api.dailyRevisions
  //     .generate({
  //       date: currentDate,
  //     })
  //     .then((res) => {
  //       if (res.error !== undefined) {
  //         console.log(res);
  //         router.back();
  //         return;
  //       }

  //       createRevisionDeckFromCards(api, res.cards).then(
  //         ({ error, revisionDeck }) => {
  //           if (error) {
  //             console.log("Error while creating revision deck", error);
  //             return;
  //           }

  //           setRevisionDeck(revisionDeck);
  //         }
  //       );

  //       console.log(res);
  //     });
  // }, []);

  useEffect(() => {
    // const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    //  api.dailyRevisions.generate (date: currentDate)

    const cards = mockResourceDemo.cards.map((card) => ({
      ...card,
      resourceHeader: mockResourceDemo,
    }));

    const { revisionDeck } = createRevisionDeckFromCards(cards);
    setRevisionDeck(revisionDeck);
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

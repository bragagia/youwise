import { resourceDemo } from "@/app/db/MOCK";
import RevisionComponent from "@/app/revision/RevisionComponent";
import { createRevisionDeckFromResource } from "@/app/revision/useLocalRevisionEngine";
import { useAPI } from "@/lib/api/apiProvider";
import React from "react";

const RevisionPage = async () => {
  const api = useAPI();
  const revisionDeck = await createRevisionDeckFromResource(api, resourceDemo);

  return <RevisionComponent revisionDeck={revisionDeck} />;
};

export default RevisionPage;

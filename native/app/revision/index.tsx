import { resourceDemo } from "@/app/db/MOCK";
import RevisionComponent from "@/app/revision/RevisionComponent";
import { createRevisionDeckFromResource } from "@/app/revision/useLocalRevisionEngine";
import React from "react";

const RevisionPage = () => {
  return (
    <RevisionComponent
      revisionDeck={createRevisionDeckFromResource(resourceDemo)}
    />
  );
};

export default RevisionPage;

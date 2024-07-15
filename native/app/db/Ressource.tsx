type ResourceBlock =
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "youtube";
      youtubeId: string;
    }
  | {
      type: "title";
      level: 1 | 2 | 3;
      content: string;
    }
  | {
      type: "image";
      source: string;
    };

export type Ressource = {
  name: string;
  resourceGroup?: {
    name: string;
  };
  tint: number;
  sourceUrl: string;
  content: ResourceBlock[];
};

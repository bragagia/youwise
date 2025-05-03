import { Resource, ResourceWithCardsAndMemory } from "@/lib/types/ressource";
import { uuid } from "../../lib/uuid";

export const mockRessources: Resource[] = [
  {
    id: "1",
    name: "Dance Monkey",
    tint: 0,
    originalUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: "",
    // content: [
    //   {
    //     type: "youtube",
    //     youtubeId: "q0hyYWKXF0Q",
    //   },
    // ],
  },
  {
    id: "2",
    name: "Learn chest compression",
    tint: 1,
    originalUrl:
      "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/first-aid/chest-compressions",
    content: "",
    // content: [
    //   {
    //     type: "title",
    //     level: 1,
    //     content: "How to perform chest compressions",
    //   },
    //   {
    //     type: "paragraph",
    //     content:
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula, urna nec ultrices fermentum, nisi nisl consectetur mi, ac tincidunt ante magna sit amet magna. Nullam vehicula, urna nec ultrices fermentum, nisi nisl consectetur mi, ac tincidunt ante magna sit amet magna.",
    //   },
    // ],
  },
  {
    id: "3",
    name: "Science Fiction",
    tint: 30,
    originalUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: "",
    // content: [
    //   {
    //     type: "youtube",
    //     youtubeId: "q0hyYWKXF0Q",
    //   },
    // ],
  },
  {
    id: "4",
    name: "Geography",
    tint: 210,
    originalUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: "",
    // content: [
    //   {
    //     type: "youtube",
    //     youtubeId: "q0hyYWKXF0Q",
    //   },
    // ],
  },
];

export const mockResourceDemo: ResourceWithCardsAndMemory = {
  ...mockRessources[2],
  cards: [
    {
      id: uuid(),
      memory: null,
      variants: [
        {
          type: "classic",
          question: [
            "What is the answer to life, the universe, and everything?",
          ],
          answer: ["42"],
          fakeAnswers: [["43"], ["41"], ["40"], ["39"], ["38"], ["44"]],
        },
      ],
    },
    {
      id: uuid(),
      memory: null,
      variants: [
        {
          type: "classic",
          question: ["What is AlphaGo?"],
          answer: ["A computer program that plays the board game Go."],
          fakeAnswers: [
            ["A computer program that plays the board game Chess."],
            ["A computer program that plays the board game Checkers."],
            ["A computer program that plays the board game Othello."],
            ["A computer program that plays the board game Shogi."],
          ],
        },
      ],
    },
    {
      id: uuid(),
      memory: null,
      variants: [
        {
          type: "classic",
          question: ["What is the capital of France?"],
          answer: ["Paris"],
          fakeAnswers: [
            ["London"],
            ["Berlin"],
            ["Madrid"],
            ["Rome"],
            ["Brussels"],
            ["Lisbon"],
          ],
        },
      ],
    },
  ],
};

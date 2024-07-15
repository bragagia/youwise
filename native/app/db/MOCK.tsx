import { Ressource } from "@/app/db/Ressource";
import { uuid } from "../../lib/uuid";
import { Memory } from "./Memory";

export const ressources: Ressource[] = [
  {
    name: "Dance Monkey",
    tint: 0,
    resourceGroup: {
      name: "Music",
    },
    sourceUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: [
      {
        type: "youtube",
        youtubeId: "q0hyYWKXF0Q",
      },
    ],
  },
  {
    name: "Learn chest compression",
    tint: 1,
    resourceGroup: {
      name: "First Aid",
    },
    sourceUrl:
      "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/first-aid/chest-compressions",
    content: [
      {
        type: "title",
        level: 1,
        content: "How to perform chest compressions",
      },
      {
        type: "paragraph",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vehicula, urna nec ultrices fermentum, nisi nisl consectetur mi, ac tincidunt ante magna sit amet magna. Nullam vehicula, urna nec ultrices fermentum, nisi nisl consectetur mi, ac tincidunt ante magna sit amet magna.",
      },
    ],
  },
  {
    name: "SF",
    resourceGroup: {
      name: "Culture geek",
    },
    tint: 30,
    sourceUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: [
      {
        type: "youtube",
        youtubeId: "q0hyYWKXF0Q",
      },
    ],
  },
  {
    name: "Geography",
    resourceGroup: {
      name: "Europe",
    },
    tint: 210,
    sourceUrl: "https://www.youtube.com/watch?v=q0hyYWKXF0Q",
    content: [
      {
        type: "youtube",
        youtubeId: "q0hyYWKXF0Q",
      },
    ],
  },
];

const resourceSF = ressources[2];
const resourceGeo = ressources[3];

export const memories: Memory[] = [
  {
    id: uuid(),
    card: {
      resource: resourceSF,
      value: {
        type: "classic",
        variants: [
          {
            type: "fake-answer",
            question: [
              "What is the answer to life, the universe, and everything?",
            ],
            answer: ["42"],
            fakeAnswers: [["43"], ["41"], ["40"], ["39"], ["38"], ["44"]],
          },
        ],
      },
    },

    memoryStatus: "new",
  },

  {
    id: uuid(),
    card: {
      resource: resourceSF,
      value: {
        type: "classic",
        variants: [
          {
            type: "fake-answer",
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
    },

    memoryStatus: "review",
  },

  {
    id: uuid(),
    card: {
      resource: resourceGeo,
      value: {
        type: "classic",
        variants: [
          {
            type: "fake-answer",
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
    },

    memoryStatus: "new",
  },
];

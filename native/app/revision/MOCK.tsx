import { uuid } from "../../lib/uuid";
import { Memory } from "./Memory";

const resourceSF: Memory["card"]["resource"] = {
  name: "SF",
  resourceGroup: {
    name: "Culture geek",
  },
  tint: 30,
};

const resourceGeo: Memory["card"]["resource"] = {
  name: "Geography",
  resourceGroup: {
    name: "Europe",
  },
  tint: 210,
};

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

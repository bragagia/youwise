import { Memory } from "./memory";

export type CardWithMemory = Card & {
  memory?: Memory;
};

export type Card = {
  id: string;
  variants: CardVariant[]; // Each card should have a single variant by default, but if the piece of knowledge must be known in both side, there should be a reversed variant (eg: What's the capital of France? Paris + the variant: Of which country is Paris the capital? France)
};

export type CardGPTOutput = {
  variants: CardVariant[]; // Each card should have a single variant by default, but if the piece of knowledge must be known in both side, there should be a reversed variant (eg: What's the capital of France? Paris + the variant: Of which country is Paris the capital? France)
};

export type CardVariant = ClassicCardVariant | TextCardVariant;

// * ClassicCardVariant are used to memorize standalone facts
export type ClassicCardVariant = {
  type: "classic";
  question: CardBlocks; // Eg: "What is the capital of France?"
  answer: CardBlocks; // Eg: "Paris"

  fakeAnswers?: CardBlocks[]; // eg: ["London", "Lyon", "Marseille", "Berlin", "Madrid"] -> The fakeAnswers field can only be used when the actual answer field is short (max 5 words). This field should be used whenever possible to allow the card to be sometimes presented as a quiz. If the field is used, there should be 3 fake answers, ideally 6 to change them every time the card is presented. The fake answers should be plausible and not too easy to guess. If the answer is yes or no, there can be only 1 fake answer.
};

// * TextCardVariant are used to memorize long texts or quote by heart. The text is cut in parts.
export type TextCardVariant = {
  type: "text";
  title: CardBlocks;
  text: TextCardPart[];
};

export type TextCardPart = {
  id: string; // Unique ID to identify the part (I an AI generate those parts, it must always fill this field with an empty string "")
  part: CardBlocks; // Must be smart cut by AI to be at least multiple words but not more than 10
}[];

// * Card blocks
export type CardBlocks = CardBlockPrimitive | CardBlockPrimitive[];
export type CardBlockPrimitive = string;

/*
* Examples of cards list

{
  cards: [
    {
      "variants": [
        {
          "type": "classic",
          "question": "What is the capital of France?",
          "answer": "Paris",
          "fakeAnswers": ["London", "Lyon", "Marseille", "Berlin", "Madrid"]
        },
        {
          "type": "classic",
          "question": "Of which country is Paris the capital?",
          "answer": "France",
          "fakeAnswers": ["Italy", "Spain", "Germany", "Belgium", "Portugal"]
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "What is the role of the mitochondrion?",
          "answer": "The powerhouse of the cell",
          "fakeAnswers": ["The membrane of the cell", "The center of the cell", "The guardian of the cell"]
        },
        {
          "type": "classic",
          "question": "What is referred to as the powerhouse of the cell?",
          "answer": "The mitochondrion.",
          "fakeAnswers": ["The nucleus.", "The ribosome.", "The lysosome."]
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "Name the process by which plants make their food.",
          "answer": "Photosynthesis",
          "fakeAnswers": ["Respiration", "Transpiration", "Evaporation", "Condensation", "Precipitation"]
        },
        {
          "type": "classic",
          "question": "What is photosynthesis?",
          "answer": "The process by which plants make their food.",
        }
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "Who wrote 'Hamlet'?",
          "answer": "William Shakespeare",
          "fakeAnswers": ["Christopher Marlowe", "Ben Jonson", "John Webster", "Thomas Kyd", "Francis Bacon"]
        },
      ]
    },
    {
      "variants": [
        {
          "type": "classic",
          "question": "At what temperature does water boil?",
          "answer": "100 degrees Celsius",
          "fakeAnswers": ["90 degrees Celsius", "80 degrees Celsius", "70 degrees Celsius", "110 degrees Celsius", "120 degrees Celsius"]
        },
        {
          "type": "classic",
          "question": "What special happens at 100 degrees Celsius?",
          "answer": "Water boil",
        }
      ]
    },
    {
      "variants": [
        {
          "type": "text",
          "title": ["Helen Keller quote"],
          "text": [
            {
              "id": "",
              "part": ["The best and most beautiful things in the world"]
            },
            {
              "id": "",
              "part": ["cannot be seen or even touched"]
            },
            {
              "id": "",
              "part": ["- they must be felt with the heart."]
            }
          ]
        }
      ]
    }
  ]
}

*/

/*
! Future code
*/

// longAnswer?: CardBlocks; // eg: ["Paris is the capital of France."] -> Must be used if an occlusion is provided, should be a full sentence that should contains the whole context, because the question won't be shown in that case.
// occludeLongAnswerText?: string; // eg: "Paris" -> Define which exact string of the longAnswer should be occluded if the text is different from the regular answer. The user will be tasked to remember those parts. All the occluded part are hidden at the same time.

// export type CardImageBlock = {
//   type: "image";
//   // Not implemented yet
//   blockId: string;
//   imageId: string;
//   occludeParts?: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   }[]; // Those parts will always be occluded, even when the answer is shown. This is useful for hiding other cards answers in the image
// };

// // ClassicCardOcclusionBlock are used to hide a block
// export type ClassicCardOcclusionBlock = {
//   type: "block";
//   blockId: string;
//   blockImageSection?: {
//     x: number;
//     y: number;
//     width: number;
//     height: number;
//   };
// };

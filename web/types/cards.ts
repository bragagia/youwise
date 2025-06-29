// Additional types for card variants (from original file)
export type CardVariant = ClassicCardVariant;

export interface ClassicCardVariant {
  type: "classic";
  question: string;
  answer: string;
  fakeAnswers?: string[];
}

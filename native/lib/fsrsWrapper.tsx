import { Card, createEmptyCard, fsrs, Rating, State } from "ts-fsrs";
import { MemoryParams, MemoryParamsState } from "youwise-shared/api";

export function IsMemoryParamsLearned(memoryParams: MemoryParams): boolean {
  if (!memoryParams || memoryParams.fsrs_state !== "Review") {
    return false;
  }

  return true;
}

export function IsMemoryParamsFirstReview(memoryParams: MemoryParams): boolean {
  if (!memoryParams || memoryParams.fsrs_state === "Learning") {
    return true;
  }

  return false;
}

export function WasMemoryParamsForgotten(memoryParams: MemoryParams): boolean {
  if (!memoryParams) {
    return false;
  }

  return memoryParams.fsrs_state === "Relearning";
}

export function ScheduleMemoryParams(
  memoryParams: MemoryParams,
  rating: "Good" | "Fail"
): MemoryParams {
  const easy = FSRSScheduleMemoryOnOneDifficulty(memoryParams, rating, "Easy");
  const normal = FSRSScheduleMemoryOnOneDifficulty(
    memoryParams,
    rating,
    "Normal"
  );
  const hard = FSRSScheduleMemoryOnOneDifficulty(memoryParams, rating, "Hard");
  const harder = FSRSScheduleMemoryOnOneDifficulty(
    memoryParams,
    rating,
    "Harder"
  );

  return fsrsCardToMemoryParams(normal, {
    dueEasy: easy.due,
    dueNormal: normal.due,
    dueHard: hard.due,
    dueHarder: harder.due,
  });
}

// ### Internals

type MemoryDifficulty = "Easy" | "Normal" | "Hard" | "Harder";

const DifficultyToRetention: {
  [key in MemoryDifficulty]: number;
} = {
  Easy: 0.95,
  Normal: 0.9,
  Hard: 0.85,
  Harder: 0.8,
};

const MemoryStateToCardState: {
  [key in MemoryParamsState]: State;
} = {
  Learning: 1,
  Review: 2,
  Relearning: 3,
};

const CardStateToMemoryState: {
  [key in Exclude<State, 0>]: MemoryParamsState;
} = {
  1: "Learning",
  2: "Review",
  3: "Relearning",
};

function fsrsCardToMemoryParams(
  card: Card,
  dates: {
    dueEasy: Date;
    dueNormal: Date;
    dueHard: Date;
    dueHarder: Date;
  }
): MemoryParams {
  if (card.state === 0) {
    return null;
  }

  return {
    dueEasy: dates.dueEasy.toISOString(),
    dueNormal: dates.dueNormal.toISOString(),
    dueHard: dates.dueHard.toISOString(),
    dueHarder: dates.dueHarder.toISOString(),
    fsrs_state: CardStateToMemoryState[card.state],
    fsrs_stability: card.stability,
    fsrs_difficulty: card.difficulty,
    fsrs_elapsed_days: card.elapsed_days,
    fsrs_scheduled_days: card.scheduled_days,
    fsrs_reps: card.reps,
    fsrs_lapses: card.lapses,
    fsrs_last_review: card.last_review?.toISOString() || null,
  };
}

function MemoryParamsToFSRSCard(memory: MemoryParams): Card {
  if (!memory) {
    return createEmptyCard();
  }

  return {
    due: new Date(memory.dueNormal),
    stability: memory.fsrs_stability,
    difficulty: memory.fsrs_difficulty,
    elapsed_days: memory.fsrs_elapsed_days,
    scheduled_days: memory.fsrs_scheduled_days,
    reps: memory.fsrs_reps,
    lapses: memory.fsrs_lapses,
    state: MemoryStateToCardState[memory.fsrs_state],
    last_review: memory.fsrs_last_review
      ? new Date(memory.fsrs_last_review)
      : undefined,
  };
}

function FSRSScheduleMemoryOnOneDifficulty(
  memory: MemoryParams,
  rating: "Good" | "Fail",
  difficulty: MemoryDifficulty
): Card {
  const f = fsrs({
    request_retention: DifficultyToRetention[difficulty],
  });

  const card = memory ? MemoryParamsToFSRSCard(memory) : createEmptyCard();

  const ret = f.repeat(card, new Date());

  const fsrsRating = rating === "Good" ? Rating.Good : Rating.Again;
  return ret[fsrsRating].card;
}

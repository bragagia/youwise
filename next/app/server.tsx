"use server";

import { newOpenAI } from "@/lib/openai";
import { uuid } from "@/lib/uuid";
import { Prisma, PrismaClient } from "@prisma/client";

const SYSTEM_PROMPT = `
You are acting as flash card creator.

You will be provided a text ressource as input that is going to be a course or any ressource a student wants to learn.
You will help him to learn the ressource by extracting all the important informations that should be memorized.
The student will first learn the resource by reading it, and, once he has acquired comprehension, he will use your flash card for retention.
Only include information that are relevant to memorize, this is very important. For example, unless the ressource is specifically about it, do not include meta information like the author name, the publication date, etc.

citation must be the exact text from the ressource, it must never include multiple lines. If there is missing info from the citation, it's ok, you can include them in the answer and question field reformulated.

Your output must be JSON and respect this format :
[
    { "citation": "The big bang happened 13.8 billion years ago", "question": "When did the big bang happen?", "answer": "The big bang happened 13.8 billion years ago" },
]

The answer field is optional, only include it if the citation is not a well formulated answer.

citation must be a sentence that is relevant to memorize, it is not necessarily exactly the same as provided in the input ressource. citation field will be used as response in the flash card. It must be self-sufficient, and not require the question to be understood.

Example of good and bad citation/answer/question trouple:
Good: { "citation": "The big bang happened 13.8 billion years ago", "question": "When did the big bang happen?" }

Bad: { "citation": "The big bang is a very significant moment in universe history", "question": "What is a significant moment in universe history?", "answer": "The big bang" }
-> Info is not factual enough. Question can have multiple valid answers. Answer is not self-sufficient.

You never use markdown balises to format your output, you answer directly in JSON format. (in other word, never use \`\`\` or \`\`\`json to format your output)
`;

const ARTICLE = `First read: preview and skimming for gist
Before you read the article, you should skim it first. The skim should be very quick and give you the gist (general idea) of what the article is about. You should be looking at the title, author, headings, pictures, and opening sentences of paragraphs for the gist.
Second read: key ideas and understanding content
Now that you’ve skimmed the article, you should preview the questions you will be answering. These questions will help you get a better understanding of the concepts and arguments that are presented in the article. Keep in mind that when you read the article, it is a good idea to write down any vocab you see in the article that is unfamiliar to you.
By the end of the second close read, you should be able to answer the following questions:
What was life like in early farming villages?
How was life in early farming villages different from life in hunter-gatherer communities?
What do we know about women’s lives in early farming villages? How did this change as early farming villages grew?
What are some examples of trade between villages? How do historians know about this trade?
How did changes in production and distribution affect communities?
In what ways did village networks affect the population of villages, towns, and cities?
Third read: evaluating and corroborating
Finally, here are some questions that will help you focus on why this article matters and how it connects to other content you’ve studied.
At the end of the third read, you should be able to respond to these questions:
Because there’s a lack of written records from early villages, historians and anthropologists mostly rely on archeological data as evidence. What do you think are some of the limitations of archeological evidence? Are there any pieces of evidence presented in this article that you could interpret differently than the author did?
How does this article help you think about the Era 3 Problem: How did new complex societies develop and what was their impact on humans both inside and outside these communities?
Now that you know what to look for, it’s time to read! Remember to return to these questions once you’ve finished reading.
Village Networks
Birds-eye view drawing shows a network of structures and homes. 
By Eman M. Elshaikh
For much of human history, we lived in small villages and towns, not in the large cities and societies we’re used to today. What was life like in these villages?
Introduction
One of the most significant moments in human history was the advent of farming. It didn't all happen at the same time or to the same extent across societies, but the switch from looking for food to growing it changed everything. Farming allowed humans to actually store extra food, leaving more time for activities that weren't always about eating, like the establishment of complex societies.
Painting shows a couple using what appears to be a tilling machine pulled by an ox. Below them are several plants.
Sennedjem and his wife in the fields sowing and tilling, from the Tomb of Sennedjem, The Workers’ Village, New Kingdom (wall painting)
As with most big changes, it didn't happen overnight. Cities, states, and societies evolved over a long period of human history. Most communities from this period lived in villages and small towns. Even the Roman Empire was mostly people living in small, agricultural settlements.
These early villages grew in different ways. Some were proto-cities that eventually developed into large urban population centers and parts of states. Others remained self-sufficient villages, exchanging with other villages in networks.
We don't have written records from most villages, but archeological excavations have literally unearthed a lot of information about village life. Things like clothing and mud homes don't usually survive after thousands of years. But pottery, artifacts made from shells, and homes made of sturdy materials last longer. Looking at the surviving objects of infrastructure, archeologists and historians have been able to reconstruct a story about early village life.
Social life before the city
So what was life like before farming gave us all this free time? Many scholars consider earlier foraging societies to be largely egalitarian, meaning that there was comparatively less social inequality. It seems like this continued to be the case in early farming villages, where people had relatively equal social status. Most people living in villages spent the majority of their time producing food. Hunting, foraging, caring for animals, and growing food was still everyone's primary job. Although some people began to work on storing and preserving food, labor was mostly divided by gender, with women spending more time taking care of small children but also participating in food production. However, these gender divisions did not necessarily mean gender inequalities.
How do historians know this? Archeological evidence shows that people in villages probably shared tools and work spaces. Excavations of the Tripolye culture (c. 5200- 3500 BCE) in modern-day Ukraine and of the town of Çatalhüyük (c. 7500-5700 BCE) in modern-day Turkey show that homes were mostly about the same size, and the objects in homes and graves were of relatively equal value. Analysis of human bones also tells us that people living in villages had similar diets.
Photo shows what the inside of a typical dwelling might have looked like: there is a woodstove, a ladder, a grindstone, woven mat, and pottery. 
A restoration of a typical living quarter in Catal Hüyük. By Elelicht, CC BY-SA 3.0.
People living in farming communities had pretty different lives from their hunter-gatherer ancestors. They lived in closer quarters, allowing disease to spread much faster, and some research suggests that people had more anxieties about disease. Also, as their food supply became increasingly dependent on favorable environmental conditions, they worried more about the weather. The weather was so important that it influenced many spiritual beliefs and practices, and honoring the source of life and the Earth were often at the center of early religious beliefs. Some artifacts found in early villages suggest that women were regarded as the source of life because they symbolized fertility. For example, goddess figures found in Çatalhüyük depict feminine deities.
Sculpture shows a female body in a seat with two animals by her side.
Seated Mother Goddess of Çatalhüyük c.5500 BCE. By Nevit Dilmen, CC BY-SA 3.0.
However, that celebration of the feminine did not exactly put farming communities at the forefront of gender equality. As these villages introduced things like permanent dwellings, the concept of ownership, and a more specific definition of family, gender hierarchies tended to intensify. Kinship systems in general became more complicated and rigid. Hunter-gatherer societies had needed full-time effort from all men and women to stay fed, but the new farming communities could build up surpluses of food, allowing women to have more children. Over time, most women's lives became less about the work of food production and more about children and maintaining small family homes.
Before long-distance trade
Usually when we talk about trade and its tremendous impact on human history, we think of ships crossing oceans. But long before any of that happened, villages began trading with each other in local networks, and that development was also pretty major.
When farming villages started trading with nomadic foraging communities and other farming communities, they could get their hands on things like obsidian. This specialty of the people from Çatalhüyük was a hard volcanic glass that villagers used to create many tools. This old-school hardware wasn't just in Turkey — archeologists have also traced obsidian trade among village networks in the many islands of Oceania. The Lapita culture, which existed from about 1600-500 BCE, left behind plenty of obsidian artifacts, as well as ceramics, marine shells, and plants. The excavation sites on these islands suggest that inter-island trade occurred way before long-distance trade routes emerged. In the Americas during the last millennium BCE, coastal villages in the Norte Chico society (Peru today) traded fish, mollusks, and shells with inland villages, which cultivated corn, textiles, potatoes, quinoa, and cattle, specifically llamas.
Photo of small, shiny, black rocks.
Obsidian mirrors excavated by James Mellaart and his team in Çatalhöyük. By Omar hoftun, CC BY-SA 3.0.
Map shows small area where Lapita pottery has been found between three larger regions.
Region where Lapita pottery has been found. By Christophe cagé, CC BY-SA 3.0.
Well, once you start trading potatoes and llamas, it isn't long before you're building roads, bridges, and irrigation and drainage systems. This kind of trade also contributed to food surpluses and specialization as villages grew more productive. In studying the lives of people living in village communities and the networks between them, historians can see the emergence of new social functions. More people made pottery, wove baskets and cloth, and worked with leather and wood. Labor became increasingly divided, and larger projects needed to be coordinated by administrators and leaders. This resulted in greater social hierarchies, with more defined notions of property, class, and caste.
Sure enough, the archeological record bears this out. Burial sites start to look very different from one another, with some graves—including those of children—containing gold artifacts and jewelry, while others did not. The fact that even children had such valuable items in their graves suggests that people in villages and towns began to accumulate private wealth and transfer it across generations, providing evidence of the beginning of social classes.
Similarly, gender roles generally changed. Male heads of family tended to gain control over wealth, and political considerations required more defined families and strategic marriage alliances. However, this didn't happen everywhere in quite the same way, and there was still plenty of variety in the way people understood gender and family in different regions of the world.
Trade helped villages grow, but village networks also boosted trade in a big way. As trade routes grew, villages located near trade hubs or that controlled strategic crossings were able to grow even faster. This cycle reinforced itself over time. Eventually, many villages would come together into large urban centers, creating a type of social life in the city that looked very different from village life.
Author bio
The author of this article is Eman M. Elshaikh. She is a writer, researcher, and teacher who has taught K-12 and undergraduates in the United States and in the Middle East. She teaches writing at the University of Chicago, where she also completed her master’s in social sciences and is currently pursuing her PhD. She was previously a World History Fellow at Khan Academy, where she worked closely with the College Board to develop curriculum for AP World History.`;

const ARTICLE_SHORT = `So what was life like before farming gave us all this free time? Many scholars consider earlier foraging societies to be largely egalitarian, meaning that there was comparatively less social inequality. It seems like this continued to be the case in early farming villages, where people had relatively equal social status. Most people living in villages spent the majority of their time producing food. Hunting, foraging, caring for animals, and growing food was still everyone's primary job. Although some people began to work on storing and preserving food, labor was mostly divided by gender, with women spending more time taking care of small children but also participating in food production. However, these gender divisions did not necessarily mean gender inequalities.
How do historians know this? Archeological evidence shows that people in villages probably shared tools and work spaces. Excavations of the Tripolye culture (c. 5200- 3500 BCE) in modern-day Ukraine and of the town of Çatalhüyük (c. 7500-5700 BCE) in modern-day Turkey show that homes were mostly about the same size, and the objects in homes and graves were of relatively equal value. Analysis of human bones also tells us that people living in villages had similar diets.
Photo shows what the inside of a typical dwelling might have looked like: there is a woodstove, a ladder, a grindstone, woven mat, and pottery. 
A restoration of a typical living quarter in Catal Hüyük. By Elelicht, CC BY-SA 3.0.`;

type HighlightWithQuestion = {
  citation: string;
  answer?: string;
  question: string;
};

import { z } from "zod";

const HighlightWithQuestionArraySchema = z.array(
  z.object({
    citation: z.string(),
    answer: z.string().optional(),
    question: z.string(),
  })
);

export async function callOpenAISA() {
  const openai = newOpenAI();
  const session = getSession();
  const prisma = new PrismaClient();

  const article = ARTICLE_SHORT;

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: article },
    ],
    model: "gpt-4o",
  });

  if (chatCompletion.usage) {
    await prisma.aIUsage.create({
      data: {
        userId: session.userId,
        model: "gpt-4o",
        promptTokens: chatCompletion.usage.prompt_tokens,
        responseTokens: chatCompletion.usage.completion_tokens,
      },
    });
  }

  if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
    throw new Error("No completion");
  }

  let highlightsWithQuestions: HighlightWithQuestion[];
  try {
    highlightsWithQuestions = HighlightWithQuestionArraySchema.parse(
      JSON.parse(chatCompletion.choices[0].message.content || "")
    );
  } catch (e) {
    console.log(
      "Invalid completion",
      chatCompletion.choices[0].message.content
    );
    throw new Error("Invalid completion");
  }

  const resource = await prisma.resource.create({
    data: {
      ownerUserId: session.userId,
      resourceType: "article",
      name: "History of something",
      content: article,
    },
  });

  let questions: Prisma.QuestionCreateManyInput[] = [];

  const highlights: Prisma.HighlightCreateManyInput[] =
    highlightsWithQuestions.map((highlight) => {
      const highlightId = uuid();

      questions.push({
        highlightId: highlightId,
        ownerUserId: session.userId,
        resourceId: resource.id,
        question: highlight.question,
        answer: highlight.answer,
      });

      return {
        id: highlightId,
        userId: session.userId,
        highlightedText: highlight.citation,
        resourceId: resource.id,
        isAiCreated: true,
      };
    });

  await prisma.highlight.createMany({
    data: highlights,
  });

  await prisma.question.createMany({
    data: questions,
  });

  return highlightsWithQuestions;
}

export async function createUserSA() {
  const prisma = new PrismaClient();

  const user = await prisma.user.create({
    data: {
      email: "mathias@bragagia.com",
      password: "12345",
    },
  });

  console.log("User created", user.id);
}

function getSession() {
  return { userId: "aef289ae-8b71-44ab-8d09-e5727f6bed18" };
}

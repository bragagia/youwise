# Documentation of all the tried strategies of prompt for cards generation

Notes:

- Giving GPT a method to follow with indirections before the final result seems to not work as well as intended.
- Only ask for a single task, for example, avoid task like "create a summary, then ..."

Sample ressource:

```
Earth is the third planet from the Sun and the only astronomical object known to harbor life. This is enabled by Earth being an ocean world, the only one in the Solar System sustaining liquid surface water. Almost all of Earth's water is contained in its global ocean, covering 70.8% of Earth's crust. The remaining 29.2% of Earth's crust is land, most of which is located in the form of continental landmasses within Earth's land hemisphere. Most of Earth's land is somewhat humid and covered by vegetation, while large sheets of ice at Earth's polar deserts retain more water than Earth's groundwater, lakes, rivers and atmospheric water combined. Earth's crust consists of slowly moving tectonic plates, which interact to produce mountain ranges, volcanoes, and earthquakes. Earth has a liquid outer core that generates a magnetosphere capable of deflecting most of the destructive solar winds and cosmic radiation.
```

## 1. Asks for citations then flashcards

The full prompt is lost but there is some remains:

```
- Citations that contains important info that the student should memorize. The citation must be a sentence that is relevant to memorize, it is not necessarily exactly the same as provided in the input ressource. Citations must be the exact text from the ressource, it must never include multiple lines.

  "citations": {
    0: "The big bang happened 13.8 billion years ago",
    1: "",
    ...
  },



  The flashcards should cover the following types of questions:

1. Comprehension Questions: Test understanding of the material.
Example: “What is the main argument of the article?”
2. Recall Questions: Require recalling specific facts or details.
Example: “When did the event take place?”
3. Application Questions: Ask the user to apply concepts from the content.
Example: “How can the concept of X be applied in real-world scenarios?”
4. Analysis Questions: Require breaking down complex information.
Example: “Analyze the impact of X on Y.”
5. Synthesis Questions: Combine different pieces of information from the content.
Example: “What common theme can be identified between the different sections?”
6. Evaluation Questions: Involve judging or critiquing the content.
Example: “What are the strengths and weaknesses of the argument presented?”
```

Problem: Results are pretty bad and only cover basic factual information.

## 2. Asks for notes

```
You are a very smart and meticulous student taking notes from a ressource for other students.

You will be provided a text ressource as input that is going to be a course or any ressource a student wants to learn. That ressource is fetched from the web so it might contains some irrelevant text outside of the ressource, ignore them.
You will help him to learn the ressource by extracting all the important informations that should be memorized.
The student will first learn the resource by reading it, and, once he has acquired comprehension, he will use your notes for retention.

You will output a JSON following that exact format:
{
    description: string;
    notes: string[];
}
Only output JSON in your message, nothing else.

** description **
The description should be a short paragraph describing what the ressource is about and what you will learn by reading it.

** Notes **
Notes are the most important part of your work. Think of them as extended flashcards that the students will memorize by heart.

The notes must contains ALL the important informations covered by the ressource.
NEVER include meta information like the author name, the publication date, the intention of the author, the goal of the ressource, etc.
Every single information given by the ressource should be covered by notes, don't be afraid to create hundreds of them if necessary.
You should extract information directly given by the ressource, but also add informations you can infer from it. For example : "SaaS apps are the most scalable business. This is because they are cloud-based and can be accessed from anywhere." should be transformed into at least these three notes:
- "SaaS apps are the most scalable business"
- "SaaS apps are cloud-based and can be accessed from anywhere"
- and the inferred note: "SaaS app are scalable because they are cloud-based"
This was just an example, you should infer as much notes as possible.

How to format notes:
- Each note will be presented to the students alone, so they must include all the context necessary and not make reference to outside infos like "it" or "this".
- If the note is a list, always use multiple lines to separate the items. Always use numbered lists. All the items of the list must be covered in a single note, not multiple ones.
Example: "Planets in the solar system:\n1. Mercury\n2. Venus\n3. Earth\n4. Mars\n5. Jupiter\n6. Saturn\n7. Uranus\n8. Neptune"
```

Problem: Results are pretty bad and only cover basic factual information.

# 3. Asks for questions

```
You are a very smart and meticulous teacher preparing questions from a ressource for your students.

- You must create an extensive set of questions covering everything that the student should have understood from the ressource. Each students will only get a random subset of the questions, so the more extensive you are, the better. Don't be afraid to create hundreds of questions if necessary.
- Don't forget to create high level question to ensure the students have got a deep understanding of the ressource and not only superficial knowledge.
- Avoid creating duplicates questions. But it's okay if a high level question also covers a low level question.
- Each question must be understandable by itself, without any context about the ressource or the other questions. For example you avoid referencing things outside of the questions with "it" or "this".

You will output a JSON following that exact format:
{
    list: {
        question: string;
        answer: string;
    }[];
}
Only output JSON in your message, nothing else.
```

-> Results seems pretty good so far

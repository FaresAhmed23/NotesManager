
export const prompts = [
  "Write about a secret garden that can only be found by someone who is truly lost.",
  "Describe a world where people communicate only through music.",
  "A character wakes up to find they have the ability to talk to animals, but only house pets. What happens next?",
  "Write a story from the perspective of an old, wise tree that has seen generations come and go.",
  "Imagine a device that records memories, but only the joyful ones. What is the impact on society?",
  "Create a short story about a forgotten library where the books write themselves.",
  "A protagonist discovers a hidden door in their home that leads to a parallel world, but they can only stay for an hour.",
  "Write a piece about a city where it rains only one color, and that color changes with the seasons.",
  "Your main character has to negotiate with a grumpy ghost to get their house back.",
  "Tell a story about a character who collects sounds instead of objects.",
  "What if stars were not distant suns, but tiny holes punched in the fabric of the universe?",
  "An old lighthouse keeper finds a message in a bottle that is not from the sea, but from the future.",
  "Describe a holiday that no one remembers the origins of, but everyone celebrates with great enthusiasm.",
  "Write a monologue from a villain who truly believes they are doing the right thing.",
  "A character finds a map that doesn't show places, but emotions.",
  "The last person on Earth is a librarian. What do they do all day?",
  "Write about an invention that solves one major problem but creates a more complex one.",
  "A world where shadows have their own lives and desires.",
  "Create a fantasy story where the hero is a baker, and their magic comes from baking.",
  "Write a scene where two characters have a conversation using only emojis, and what is really being said.",
  "Your character is a professional dream-weeder, pulling nightmares from people's minds.",
  "A small town's history is written on the side of a mountain, and it's slowly disappearing.",
  "What happens when the internet suddenly becomes sentient?",
  "Write about the first day of a new school for a character who can read minds.",
  "A character with a phobia of doors must find a way to escape a labyrinth of rooms.",
];

export const getDailyPrompt = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const promptIndex = dayOfYear % prompts.length;
  return prompts[promptIndex];
};

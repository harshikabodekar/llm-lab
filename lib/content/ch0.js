export const CH0_CONTENT = {
  concept: [
    "You don't need to already know how to code to finish this lab. But you do need about 20 minutes of Python — the same 20 minutes every playground after this one leans on. Let's get it out of the way, once, properly.",
    "A variable is a labeled box. `age = 25` puts 25 in a box called age. That's it. No math-class flashbacks required.",
    "A list is a row of boxes, numbered from 0. `fruits = [\"apple\", \"banana\"]` — `fruits[0]` is \"apple\", because counting starts at zero, not one. This trips up literally everyone, once. Now it won't trip up you.",
    "A function is a labeled recipe. Write it once — `def greet(name): return \"hi \" + name` — then call it as many times as you want. Every model you'll build later in this app is really just a giant pile of function calls.",
    "A loop repeats an action without you retyping it. `for x in [1, 2, 3]: print(x)`. Training a model is a loop too — predict, check, adjust, repeat, thousands of times. Below, you'll write the small version."
  ],
  simple: [
    "Think of coding like cooking in a kitchen. You need a few basic tools before you can make anything — that's all this chapter is.",
    "A variable is a labeled jar. You write 'sugar' on a jar and put sugar inside it. In code: `sugar = 5` — the jar is named sugar, and it holds the number 5. Anytime you say 'sugar' later, code checks that jar.",
    "A list is a spice rack — one shelf, many jars in a row, each jar numbered starting from 0. (Yes, the first jar is jar number 0, not jar number 1 — kitchens don't do this, but code does.)",
    "A function is a recipe card. You write the steps once — 'mix flour and water' — then cook that recipe as many times as you want, for as many people as you want, without rewriting the steps.",
    "A loop is stirring the pot until it's done, instead of stirring once and hoping. Code repeats a step (like 'stir') a set number of times, or until something becomes true — same idea, less arm ache."
  ],
  challenge:
    "Run all four cells below in order. Then go back and break one on purpose — delete a colon, misspell a variable name, remove a bracket — and read the error that comes back. Errors aren't punishment. They're the interpreter telling you exactly what confused it, in plain terms.",
  checkpoint: [
    {
      q: "In `fruits = [\"apple\", \"banana\", \"cherry\"]`, what is `fruits[1]`?",
      options: ["apple", "banana", "cherry", "an error — lists start at 1"],
      answer: 1,
      why: "python counts from 0. fruits[0] is 'apple', so fruits[1] is 'banana'."
    },
    {
      q: "Why bother writing a function instead of just copy-pasting code?",
      options: [
        "Functions run faster than regular code",
        "Python requires functions for anything longer than 3 lines",
        "Write the logic once, reuse it anywhere — change it in one place, not twenty",
        "Functions are only needed for AI code"
      ],
      answer: 2,
      why: "reuse is the whole point — one definition, called wherever you need it, fixed in one place if it's ever wrong."
    }
  ]
};

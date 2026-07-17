"use client";

import CodeCell from "../CodeCell";
import StartHere from "../StartHere";

/* python in 20 minutes — one code cell per concept, and a tour of
   all 4 CodeCell difficulty layers along the way:
   variables -> fill the blanks, lists -> arrange the blocks,
   functions -> hints, loops -> freehand. */

function CellLabel({ children }) {
  return <p className="margin-note mb-3 uppercase tracking-wide">{children}</p>;
}

export default function Ch0Playground() {
  return (
    <div className="flex flex-col gap-8">
      <StartHere>run each cell top to bottom, in order.</StartHere>

      <div>
        <CellLabel>1 · variables</CellLabel>
        <CodeCell
          what="store your name and age in labeled variables."
          why="every program — including every model in this app — starts by holding values in named variables."
          how="fill the blanks, press run, read the output."
          prompt="fill in your name and age, then hit run."
          predict={{
            question: "once you fill in the blanks, what will print?",
            options: ["your name and age, formatted as a sentence", "an error — variables don't work in strings", "just the literal words 'name' and 'age'"],
            answerIndex: 0
          }}
          layers={{
            blank: {
              template: 'name = "___"\nage = ___\nprint(name, "is", age, "years old")',
              defaults: ["", ""]
            }
          }}
          check="years old"
        />
      </div>

      <div>
        <CellLabel>2 · lists</CellLabel>
        <CodeCell
          what="read items out of a list by their index."
          why="tokens, weights, embeddings — nearly everything in an LLM lives in lists you index into."
          how="drag the 4 lines into the right order, press run."
          prompt="these 4 lines got scrambled — drag them into an order that makes sense, then run."
          predict={{
            question: "once these lines are in the right order, what prints FIRST?",
            options: ["apple", "cherry", "3 (the length)"],
            answerIndex: 0
          }}
          layers={{
            parsons: {
              lines: [
                'fruits = ["apple", "banana", "cherry"]',
                "print(fruits[0])",
                "print(fruits[2])",
                "print(len(fruits))"
              ]
            }
          }}
          check="apple"
        />
      </div>

      <div>
        <CellLabel>3 · functions</CellLabel>
        <CodeCell
          what="write a function that returns a greeting."
          why="every layer of a neural net is just a function — write one now, ch4 onward is just bigger versions of this."
          how="fill in the return line, press run — stuck? tap 'need a hint?'"
          prompt="finish the greet function so it returns 'hi ' plus the name. stuck? there's a hint button."
          predict={{
            question: "once greet() is fixed, what will print(greet(\"Asha\")) output?",
            options: ["hi Asha", "Asha hi", "an error"],
            answerIndex: 0
          }}
          layers={{
            hints: {
              starter: 'def greet(name):\n    # your code here\n    return\n\nprint(greet("Asha"))',
              hints: [
                "make the function return the text 'hi ' stuck together with whatever name was passed in.",
                'def greet(name):\n    return "hi " + ___\n\nprint(greet("Asha"))',
                'def greet(name):\n    return "hi " + name\n\nprint(greet("Asha"))  # -> hi Asha'
              ]
            }
          }}
          check="hi Asha"
        />
      </div>

      <div>
        <CellLabel>4 · loops</CellLabel>
        <CodeCell
          what="print the numbers 1 through 5 with a loop."
          why="training a model IS a loop — predict, check, adjust, repeat. this is that loop, shrunk down."
          how="write a for loop from scratch, press run."
          prompt="freehand this one — write a loop that prints the numbers 1 through 5, one per line."
          predict={{
            question: "what will your finished loop print?",
            options: ["1 2 3 4 5, one per line", "12345 all on one line", "5 4 3 2 1, counting down"],
            answerIndex: 0
          }}
          layers={{
            freehand: {
              starter: "# your loop here\n"
            }
          }}
          check={(output) => ["1", "2", "3", "4", "5"].every((n) => output.includes(n))}
        />
      </div>
    </div>
  );
}

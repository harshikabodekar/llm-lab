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
          goal="a variable that stores your name and age"
          prompt="fill in your name and age, then hit run."
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
          goal="code that reads items out of a list"
          prompt="these 4 lines got scrambled — drag them into an order that makes sense, then run."
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
          goal="a function that greets someone by name"
          prompt="finish the greet function so it returns 'hi ' plus the name. stuck? there's a hint button."
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
          goal="a loop that prints 1 through 5"
          prompt="freehand this one — write a loop that prints the numbers 1 through 5, one per line."
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

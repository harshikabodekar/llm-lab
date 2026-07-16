/* pyodide loader — python in the browser, for the code cells (day 2 build).
   loads once, cached globally. numpy included. */

let pyodidePromise = null;

export function loadPy() {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    if (!window.loadPyodide) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const py = await window.loadPyodide();
    await py.loadPackage("numpy");
    return py;
  })();
  return pyodidePromise;
}

/* runs user code, returns { ok, output } with beginner-friendly error translation */
export async function runPython(code) {
  const py = await loadPy();
  try {
    py.runPython(`
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
`);
    py.runPython(code);
    const out = py.runPython("_buf.getvalue()");
    return { ok: true, output: out || "(ran fine — nothing printed. add a print()!)" };
  } catch (e) {
    return { ok: false, output: translateError(String(e.message || e)) };
  }
}

function translateError(msg) {
  const rules = [
    [/NameError: name '(\w+)' is not defined/, (m) => `python doesn't know what '${m[1]}' is — either you haven't created it yet, or there's a typo.`],
    [/IndentationError/, () => `indentation problem — python is strict about spaces at the start of lines. lines inside a function/loop need the same indent.`],
    [/SyntaxError/, () => `syntax error — something is written in a way python can't read. check for missing colons ':', brackets, or quotes.`],
    [/TypeError: unsupported operand/, () => `you're combining two things that don't mix (like a number and a list). for arrays, you probably want np.dot or element-wise ops.`],
    [/ZeroDivisionError/, () => `you divided by zero — check the denominator, especially vector lengths that might be 0.`],
    [/IndexError/, () => `you asked for a position that doesn't exist in the list — remember python counts from 0.`]
  ];
  for (const [re, fn] of rules) {
    const m = msg.match(re);
    if (m) return `${fn(m)}\n\n(raw error: ${msg.split("\n").pop()})`;
  }
  return msg;
}

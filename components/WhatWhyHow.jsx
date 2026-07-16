// the standard task strip — every code cell and every playground gets one.
// three lines, no more: what you're doing, why it matters, how to do it.
export default function WhatWhyHow({ what, why, how }) {
  return (
    <div className="sheet-flat mb-4 bg-white p-3 font-mono text-xs leading-relaxed">
      <p>
        <span className="text-inkblue">what:</span> {what}
      </p>
      <p>
        <span className="text-inkblue">why:</span> {why}
      </p>
      <p>
        <span className="text-inkblue">how:</span> {how}
      </p>
    </div>
  );
}

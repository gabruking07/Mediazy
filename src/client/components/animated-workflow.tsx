"use client";

import Lottie from "lottie-react";

const workflowAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 420,
  h: 260,
  nm: "Mediazy workflow",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Pulse line",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [210, 130, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "sh", ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-150, 0], [0, -54], [150, 0]], c: false } } },
            { ty: "st", c: { a: 0, k: [0.145, 0.388, 0.922, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 2 },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    ...[
      { x: 60, y: 130, color: [0.145, 0.388, 0.922, 1] },
      { x: 210, y: 76, color: [0.078, 0.722, 0.651, 1] },
      { x: 360, y: 130, color: [0.976, 0.451, 0.086, 1] }
    ].map((node, index) => ({
      ddd: 0,
      ind: index + 2,
      ty: 4,
      nm: `Node ${index + 1}`,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [node.x, node.y, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [92, 92, 100] }, { t: 60, s: [112, 112, 100] }, { t: 120, s: [92, 92, 100] }] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [64, 64] } },
            { ty: "fl", c: { a: 0, k: node.color }, o: { a: 0, k: 100 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ]
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }))
  ]
};

export function AnimatedWorkflow() {
  return (
    <div className="pointer-events-none mx-auto aspect-[21/13] w-full max-w-md">
      <Lottie animationData={workflowAnimation} loop autoplay />
    </div>
  );
}

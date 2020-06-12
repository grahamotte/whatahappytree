import "mobx-react/batchingOptOut";

import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";

import React from "react";
import { observer } from "mobx-react";
import store from "./store";

export default observer(() => {
  return (
    <Stage width={store.maxX} height={store.maxY}>
      <Layer>
        <Text
          text={`Depth(+/-) == ${store.depth}`}
          fill="#000"
          fontSize={20}
          y={10}
          x={10}
          fontFamily="Courier New"
          fontStyle="bold"
        />

        <Text
          text={`Growth(up/down) == ${store.growth}`}
          fill="#000"
          fontSize={20}
          y={10 + 20}
          x={10}
          fontFamily="Courier New"
          fontStyle="bold"
        />

        <Text
          text={`Rotation(right/left) == ${store.rotation}`}
          fill="#000"
          fontSize={20}
          y={10 + 20 + 20}
          x={10}
          fontFamily="Courier New"
          fontStyle="bold"
        />

        {store.lines.map((l, i) => {
          return (
            <Line
              key={i}
              points={l.pointsInv}
              stroke={l.color}
              strokeWidth={l.thickness}
            />
          );
        })}
      </Layer>
    </Stage>
  );
});

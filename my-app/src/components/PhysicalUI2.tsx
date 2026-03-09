import {Fragment, useEffect, useRef} from "react";
import * as Matter from "matter-js"

export const PhysicalUI2 = () => {
  const requestRef = useRef<number>(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(null);

  const animate = () => {
    engineRef.current = Matter.Engine.create();
    const engine = engineRef.current;

    if (!boxRef.current) return;

    const boxW = boxRef.current.offsetWidth;
    const boxH = boxRef.current.offsetHeight;
    const box = {
      body: Matter.Bodies.rectangle(150, 0, boxW, boxH),
      elem: boxRef.current,
      render() {
        const {x, y} = this.body.position;
        boxRef.current.style.top = `${y - boxW / 2}px`;
        boxRef.current.style.left = `${x - boxH / 2}px`;
        boxRef.current.style.transform = `rotate(${this.body.angle}rad)`;
      },
    };
    const ground = Matter.Bodies.rectangle(
      0, // x
      0, // y
      400, // w
      120, // h
      {isStatic: true}
    );
    const mouseConstraint = Matter.MouseConstraint.create(
      engine,
      {element: document.body}
    );
    Matter.Composite.add(engine.world, [
      box.body,
      ground,
      mouseConstraint,
    ]);

    (function rerender() {
      box.render();
      Matter.Engine.update(engineRef.current);
      requestRef.current = requestAnimationFrame(rerender);
    })();
  };

  useEffect(() => {
    if (!requestRef.current) return;
    if (!engineRef.current) return;
    console.log("reached");
    animate();
    return () => {
      cancelAnimationFrame(requestRef.current);
      Matter.Engine.clear(engineRef.current);
      // see https://github.com/liabru/matter-js/issues/564
      // for additional cleanup if using MJS renderer/runner
    };
  }, []);

  return (
    <div>
      <div id="box" style={
        {
          position: "absolute",
          backgroundColor: "#ffffff",
          width: "100px",
          height: "50px"
        }
      } ref={boxRef}></div>
      <div id="ground" ref={groundRef}></div>
    </div>
  );
};
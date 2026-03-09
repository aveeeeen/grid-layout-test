import { useEffect, useRef, useState, forwardRef, type CSSProperties, type PropsWithChildren, useLayoutEffect, useCallback, useEffectEvent } from "react"
import {
  Engine,
  Bodies,
  MouseConstraint,
  Mouse,
  Composite,
  World,
  Body
} from 'matter-js'
import { Search } from "lucide-react";

export const PhysicalUI = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const reqIdRef = useRef<number>(0);
  const widthRef = useRef(window.innerWidth);
  const heightRef = useRef(window.innerHeight);

  // constructs
  const groundRef = useRef<Body>(null);
  const leftRef = useRef<Body>(null);
  const rightRef = useRef<Body>(null);
  const ceilingRef = useRef<Body>(null);

  // elements
  const tagRefs = useRef<HTMLDivElement[]>([]);
  const tagBodyRefs = useRef<Matter.Body[]>([]);
  const searchAreaRef = useRef<HTMLDivElement>(null);
  const searchAreaBodyRef = useRef<Matter.Body>(null);

  const tags = [
    "#AI", "#Speech To Text", "#OCR", "#AI", "#Speech To Text", "#OCR",
    "#AI", "#Speech To Text", "#OCR", "#AI", "#Speech To Text", "#OCR",
  ]

  const engine = Engine.create()
  const mouseRef = useRef<Mouse>(null)

  const init = () => {
    if(divRef.current) {
      widthRef.current = window.innerWidth;
      heightRef.current = window.innerHeight;
      console.log("ground Width: ", widthRef.current);
      console.log("ground Height: ", heightRef.current);

      groundRef.current = Bodies.rectangle(widthRef.current / 2, heightRef.current + 50 - 8, widthRef.current, 100, { isStatic: true });
      leftRef.current = Bodies.rectangle(0 - 50, heightRef.current / 2, 100, heightRef.current, {isStatic: true});
      rightRef.current = Bodies.rectangle(widthRef.current + 50, heightRef.current / 2, 100, heightRef.current, {isStatic: true});
      ceilingRef.current = Bodies.rectangle(widthRef.current / 2, 0 - 50, widthRef.current, 100, { isStatic: true });

      Composite.add(engine.world, [
        groundRef.current,
        leftRef.current,
        rightRef.current,
        ceilingRef.current
      ]);


      mouseRef.current = Mouse.create(divRef.current);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouseRef.current,
        constraint: {
          stiffness: 0.2,
        }
      });

      World.add(engine.world, mouseConstraint);

      const bodyOptions = {
        friction: 3,
        restitution: 0.01,
        mass: 10
      }

      if (tagRefs.current.length === 0 || !searchAreaRef.current) return;

      tagBodyRefs.current = tagRefs.current.map(tagRef => {
        return Bodies.rectangle(
          tagRef.offsetLeft + tagRef.clientWidth / 2,
          tagRef.offsetTop + tagRef.clientHeight / 2,
          tagRef.clientWidth,
          tagRef.clientHeight,
          bodyOptions
        )
      })

      searchAreaBodyRef.current = Bodies.rectangle(
        searchAreaRef.current.offsetLeft + searchAreaRef.current.clientWidth / 2,
        searchAreaRef.current.offsetTop + searchAreaRef.current.clientHeight / 2,
        searchAreaRef.current.clientWidth,
        searchAreaRef.current.clientHeight,
        bodyOptions
      )

      Composite.add(engine.world, tagBodyRefs.current);
      Composite.add(engine.world, searchAreaBodyRef.current);
    }
  }
  
  const animate = () => {
    Engine.update(engine);

    if(tagRefs.current.length !== 0 && tagBodyRefs.current.length !== 0) {
      tagRefs.current.forEach((tagRef, idx) => {
        tagRef.style.left = `${tagBodyRefs.current[idx].position.x - tagRef.clientWidth / 2}px`;
        tagRef.style.top = `${tagBodyRefs.current[idx].position.y - tagRef.clientHeight / 2}px`;
        tagRef.style.transform = `rotate(${tagBodyRefs.current[idx].angle}rad)`;
      })
    }

    if(searchAreaBodyRef.current && searchAreaRef.current) {
      searchAreaRef.current.style.left = `${searchAreaBodyRef.current.position.x - searchAreaRef.current.clientWidth / 2}px`;
      searchAreaRef.current.style.top = `${searchAreaBodyRef.current.position.y - searchAreaRef.current.clientHeight / 2}px`;
      searchAreaRef.current.style.transform = `rotate(${searchAreaBodyRef.current.angle}rad)`;
    }
    reqIdRef.current = requestAnimationFrame(animate);
  }
  
  let timeoutIdRef = useRef<number>(0);

  const onResize = () => {
    cancelAnimationFrame(reqIdRef.current);
    Composite.clear(engine.world, false, true);
    init();
    animate();
  }

  useLayoutEffect(() => {
    if (tagRefs.current.length === 0 || !searchAreaRef.current) return;

    addEventListener("resize", onResize);
    init();
    animate();

    return () => {
      Composite.clear(engine.world, false, true);
      tagBodyRefs.current = [];
      tagRefs.current = [];
      searchAreaRef.current = null;
      searchAreaBodyRef.current = null;
      Engine.clear(engine);
      cancelAnimationFrame(reqIdRef.current);
      removeEventListener("resize", onResize);
    }
  }, []);

  const watchInput = (text: string) => {
    console.log(text);
  };

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff"
      }}
    >
      {
        tags.map((tag, idx) => (
          <Tag
            key={idx}
            x={200 * (idx % 4 + 1) + (idx % 4 * 50) + 800}
            y={200 * (idx % 4 + 1) + (idx * 10)}
            text={tag}
            ref={el => {
              if (el) tagRefs.current.push(el)
            }}
           ></Tag>
        ))
      }

      <SearchArea
        ref={searchAreaRef}
        x={800}
        y={1200}
        onChange={() => {}}
        onSearch={text => watchInput(text)}
      ></SearchArea>
    </div>
  )
}

type TagProps = {
  x: number,
  y: number,
  width?: number,
  height?: number,
  text: string,
  props?: PropsWithChildren
}

const Tag = forwardRef<HTMLDivElement, TagProps>(({x, y, width, height, text, props}: TagProps, ref) => {

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        fontSize: "16pt",
        padding: "16px",
        left: `${x}px`,
        top: `${y}px`,
        textAlign: "center",
        width: `fit-content`,
        height: `fit-content`,
        backgroundColor: "#00af00",
        color: "#ffffff",
        zIndex: 1,
      }}
      {...props}
    >
      {text}
    </div>
  )
})

Tag.displayName = "Tag"

type SearchAreaProps = {
  x: number,
  y: number,
  width?: number,
  height?: number,
  props?: PropsWithChildren,
  onSearch: (text: string) => void,
  onChange: (text: string) => void,
}

const SearchArea = forwardRef<HTMLDivElement, SearchAreaProps> ((
  {x, y, width, height, props, onChange, onSearch
  }: SearchAreaProps, 
  ref
) => {
  const [textInput, setTextInput] = useState<string>("");
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        fontSize: "16pt",
        left: `${x}px`,
        top: `${y}px`,
        textAlign: "center",
        width: `fit-content`,
        height: `64px`,
        backgroundColor: "#00af00",
        color: "#ffffff",
        zIndex: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      {...props}
      >
        <style>
            {
              `
                .search {
                  width: fit-content;
                  height: 64px;
                  margin: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: #00af00;
                  color: #ffffff;
                  border-radius: 0;
                }
                .search:focus {
                  border: 4px solid #afaf00;
                  outline: none;
                }
                .search:hover {
                  background-color: #009f00;
                }
                .search-icon {
                  color: #ffffff;
                }
                .search-area { 
                  width: 240px;
                  height: 64px;
                  background-color: #ffffff;
                  padding: 16px;
                  border-radius: 0px;
                  border: none;
                  align-self: center;
                  justify-self: center;
                  box-shadow: inset 1px 1px 4px #333333;
                  color: #000000;
                  font-size: 24pt;
                  box-sizing: border-box;
                }
                .search-area:focus {
                    border: 4px solid #00af00;
                    outline: none;
                }
              `
            }
          </style>
        <input
          className="search-area"
          type={"text"}
          onChange={e => setTextInput(e.target.value)}
        >
        </input>
      <button
        className="search"
        onClick={() => onSearch(textInput)}
        >
        <Search
          className="search-icon" 
        />
      </button>
    </div>
  )
})
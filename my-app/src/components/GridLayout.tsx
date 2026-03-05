import { useEffect, useState } from "react";
import type { JSX } from "react";

type ImageObj = {
  path: string,
  isChecked: boolean
}

export const GridLayout = () => {
  const [imagePaths, setImagePaths] = useState<ImageObj[]>(Array.from({length: 8}, (_, idx) => {
    return {
      path: `/test-images/test${idx + 1}.png`,
      isChecked: false
    }
  }));
  const [firstSection, setFirstSection] = useState<JSX.Element[]>([]);
  const [secondSection, setSecondSection] = useState<JSX.Element[]>([]);
  const [thirdSection, setThirdSection] = useState<JSX.Element[]>([]);
  const [fourthSection, setFourthSection] = useState<JSX.Element[]>([]);
  const [translateX, setTranslateX] = useState<number>(0);
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cols = 12;
  const rows = 11;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const getRandomImage = (): ImageObj => {
    const imgs = imagePaths.filter(img => !img.isChecked);
    
    if (imgs.length === 0) return { path: "", isChecked: false };
    
    const randomIndex = Math.floor(Math.random() * imgs.length);
    const selectedImg = imgs[randomIndex];
    
    // 元の配列内での正しいインデックスを見つける
    const originalIndex = imagePaths.findIndex(
      img => img.path === selectedImg.path && !img.isChecked
    );
    
    // 正しいインデックスで状態を更新
    setImagePaths(imagePaths.map((img, idx) => 
      idx === originalIndex ? { ...img, isChecked: true } : img
    ));
    
    return selectedImg;
  }

  useEffect(() => {
    setFirstSection(Array.from({length: cols / 2}, (_, idx) => {
      if (idx % 4 === 0) {
        const img = getRandomImage();
        console.log(img);
        return <img 
          src={`${img.path}`} 
          width={cellWidth * 2}
          height={cellHeight * 2}
          >
          </img>
      }
      return <div></div>
    }))

    setSecondSection(Array.from({length: cols / 2}, (_, idx) => {
      if (idx % 4 === 1) {
        const img = getRandomImage();
        console.log(img);
        return <img 
          src={`${img.path}`} 
          width={cellWidth * 4}
          height={cellHeight * 4}
          >
          </img>
      }
      return <div></div>
    }))

    setThirdSection(Array.from({length: cols / 3}, (_, idx) => {
      if (idx % 3 === 0) {
        const img = getRandomImage();
        console.log(img);
        return <img 
          src={`${img.path}`} 
          width={cellWidth * 3}
          height={cellHeight * 3}
          >
          </img>
      }
      return <div></div>
    }))
    
    setFourthSection(Array.from({length: cols / 2}, (_, idx) => {
      if (idx % 4 === 3) {
        const img = getRandomImage();
        console.log(img);
        return <img 
          src={`${img.path}`} 
          width={cellWidth * 2}
          height={cellHeight * 2}
          >
          </img>
      }
      return <div></div>
    }))
  }, []);

  useEffect(() => {
    const onResize = () => {

    }
    window.addEventListener("resize", onResize);

    console.log("cell width:", cellWidth);
    console.log("cell Height:", cellHeight);

    return (() => {
      window.removeEventListener("resize", onResize)
    });
  }, []);

  useEffect(() => {
    let animationId: number;
    
    
    const animate = () => {
      const speed = 500;
      const time = performance.now() / 1000; // 秒単位に変換
      const dx = (time * speed) % width; // 0〜width で繰り返す
      setTranslateX(dx);
      animationId = requestAnimationFrame(animate);
      console.log(performance.now());
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationId);
  }, [width]);

  const elem = Array.from({length: cols * rows}, (_, idx) => {
    return idx
  })

  return (
    <div style={{
      transform: `translateX(${translateX}px)`
    }}>
      {/* // background container */}
      <div
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
          border: "1px solid black",
          zIndex: 0,
        }}
      >
        {
          elem.map((e, idx) => (
            <div 
              key={idx}
              style={{
                border: "1px solid black",
                backgroundColor: "#ffffff",
                margin: "4px",
                borderRadius: "5%",
                color: "#000000"
              }}
              > 
              {e} 
            </div>
          ))
        }  
      </div>

      {/* // first section (1 - 2) h = 2*/}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${cellHeight * 2}px`,
            gridTemplateColumns: `repeat(${cols / 2}, ${cellWidth * 2}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 2}px)`, 
            zIndex: 1,
        }}
      >
        {
          firstSection.map(e => e)
        }        
      </div>

      {/* // second section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 2,
            left: 0,
            width: "100%",
            height: `${cellHeight * 4}px`,
            gridTemplateColumns: `repeat(${cols / 4}, ${cellWidth * 4}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 4}px)` 
        }}
      >
      {
        secondSection.map(e => e)
      }
      </div>

      {/* // third section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 6,
            left: 0,
            width: "100%",
            height: `${cellHeight * 3}px`,
            gridTemplateColumns: `repeat(${cols / 3}, ${cellWidth * 3}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 3}px)` 
        }}
      >
      {
        thirdSection.map(e => e)
      }
      </div>
      
      {/* // fourth section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 9,
            left: 0,
            width: "100%",
            height: `${cellHeight * 2}px`,
            gridTemplateColumns: `repeat(${cols / 2}, ${cellWidth * 2}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 2}px)` 
        }}
      >
        {
        fourthSection.map(e => e)
      }
      </div>

      <div
        style={{
          top: 0,
          position: "absolute",
          left: width * -1,
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellWidth}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
          border: "1px solid black",
          zIndex: 0,
        }}
      >
        {
          elem.map((e, idx) => (
            <div 
              key={idx}
              style={{
                border: "1px solid black",
                backgroundColor: "#ffffff",
                margin: "4px",
                borderRadius: "5%",
                color: "#000000"
              }}
              > 
              {e} 
            </div>
          ))
        }  
      </div>

      {/* // first section (1 - 2) h = 2*/}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: 0,
            left: width * -1,
            width: "100%",
            height: `${cellHeight * 2}px`,
            gridTemplateColumns: `repeat(${cols / 2}, ${cellWidth * 2}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 2}px)`, 
            zIndex: 1,
        }}
      >
        {
          firstSection.map(e => e)
        }        
      </div>

      {/* // second section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 2,
            left: width * -1,
            width: "100%",
            height: `${cellHeight * 4}px`,
            gridTemplateColumns: `repeat(${cols / 4}, ${cellWidth * 4}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 4}px)` 
        }}
      >
      {
        secondSection.map(e => e)
      }
      </div>

      {/* // third section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 6,
            left: width * -1,
            width: "100%",
            height: `${cellHeight * 3}px`,
            gridTemplateColumns: `repeat(${cols / 3}, ${cellWidth * 3}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 3}px)` 
        }}
      >
      {
        thirdSection.map(e => e)
      }
      </div>
      
      {/* // fourth section (3 - 6) h = 4 */}
      <div
        style={{ 
            display: "grid",
            position: "absolute",
            top: cellHeight * 9,
            left: width * -1,
            width: "100%",
            height: `${cellHeight * 2}px`,
            gridTemplateColumns: `repeat(${cols / 2}, ${cellWidth * 2}px)`,
            gridTemplateRows: `repeat(${1}, ${cellHeight * 2}px)` 
        }}
      >
        {
        fourthSection.map(e => e)
      }
      </div>
    </div>
  )
}
// // src/components/StarryBackground.jsx
// import React, { useEffect, useState } from "react";

// const StarryBackground = () => {
//   const [stars, setStars] = useState([]);
//   const [verticalLines, setVerticalLines] = useState([]);

//   useEffect(() => {
//     // Stars
//     const tempStars = [];
//     for (let i = 0; i < 100; i++) {
//       tempStars.push({
//         id: i,
//         top: Math.random() * 100,
//         left: Math.random() * 100,
//         size: Math.random() * 2 + 1,
//         speed: Math.random() * 5 + 2,
//         opacity: Math.random() * 0.8 + 0.2,
//       });
//     }
//     setStars(tempStars);

//     // Vertical lines
//     const tempLines = [];
//     for (let i = 0; i < 30; i++) {
//       tempLines.push({
//         id: i,
//         left: Math.random() * 100,
//         height: Math.random() * 100 + 50,
//         speed: Math.random() * 5 + 2,
//         opacity: Math.random() * 0.3 + 0.1,
//       });
//     }
//     setVerticalLines(tempLines);
//   }, []);

//   return (
//     <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
//       {/* Stars */}
//       {stars.map((star) => (
//         <span
//           key={star.id}
//           className="absolute bg-white rounded-full animate-pulse"
//           style={{
//             width: `${star.size}px`,
//             height: `${star.size}px`,
//             top: `${star.top}%`,
//             left: `${star.left}%`,
//             opacity: star.opacity,
//             animationDuration: `${star.speed}s`,
//           }}
//         />
//       ))}

//       {/* Vertical lines */}
//       {verticalLines.map((line) => (
//         <span
//           key={line.id}
//           className="absolute w-[1px] bg-white animate-line"
//           style={{
//             left: `${line.left}%`,
//             height: `${line.height}px`,
//             top: `-${line.height / 2}px`,
//             opacity: line.opacity,
//             animationDuration: `${line.speed}s`,
//           }}
//         />
//       ))}

//       <style jsx>{`
//         @keyframes line-fall {
//           0% {
//             transform: translateY(-50%) scaleY(1);
//             opacity: 0;
//           }
//           50% {
//             opacity: 0.5;
//           }
//           100% {
//             transform: translateY(100vh) scaleY(1.2);
//             opacity: 0;
//           }
//         }
//         .animate-line {
//           animation: line-fall linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StarryBackground;


// src/components/CosmicBackground.jsx
import React, { useEffect, useState } from "react";

const CosmicBackground = () => {
  const [stars, setStars] = useState([]);
  const [vLines, setVLines] = useState([]);
  const [hLines, setHLines] = useState([]);

  useEffect(() => {
    // Stars
    const tempStars = [];
    for (let i = 0; i < 120; i++) {
      tempStars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 5 + 2,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }
    setStars(tempStars);

    // Vertical lines
    const tempV = [];
    for (let i = 0; i < 30; i++) {
      tempV.push({
        id: i,
        left: Math.random() * 100,
        height: Math.random() * 100 + 50,
        speed: Math.random() * 8 + 4,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setVLines(tempV);

    // Horizontal lines
    const tempH = [];
    for (let i = 0; i < 25; i++) {
      tempH.push({
        id: i,
        top: Math.random() * 100,
        width: Math.random() * 100 + 50,
        speed: Math.random() * 8 + 4,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setHLines(tempH);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-black">
      {/* Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute bg-white rounded-full animate-pulse hover:scale-125 transition-transform"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: star.opacity,
            animationDuration: `${star.speed}s`,
            boxShadow: `0 0 ${Math.random() * 4 + 2}px white`,
          }}
        />
      ))}

      {/* Vertical Lines */}
      {vLines.map((line) => (
        <span
          key={line.id}
          className="absolute w-[1px] bg-white opacity-20 animate-vline"
          style={{
            left: `${line.left}%`,
            height: `${line.height}px`,
            top: `-${line.height / 2}px`,
            opacity: line.opacity,
            animationDuration: `${line.speed}s`,
          }}
        />
      ))}

      {/* Horizontal Lines */}
      {hLines.map((line) => (
        <span
          key={line.id}
          className="absolute h-[1px] bg-white opacity-20 animate-hline"
          style={{
            top: `${line.top}%`,
            width: `${line.width}px`,
            left: `-${line.width / 2}px`,
            opacity: line.opacity,
            animationDuration: `${line.speed}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes v-move {
          0% { transform: translateY(-50%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-vline { animation: v-move linear infinite; }

        @keyframes h-move {
          0% { transform: translateX(-50%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        .animate-hline { animation: h-move linear infinite; }

        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CosmicBackground;
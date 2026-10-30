import { useState } from "react";

function Person({ x, y, shirt, skin, scale = 1, standing = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {standing ? (
        <>
          <rect
            x="-7"
            y="-22"
            width="14"
            height="22"
            rx="3"
            fill="var(--legs)"
          />
          <rect x="-9" y="-72" width="18" height="52" rx="8" fill={shirt} />
          <circle cy="-82" r="9" fill={skin} />
        </>
      ) : (
        <>
          <rect x="-9" y="-36" width="18" height="36" rx="8" fill={shirt} />
          <circle cy="-46" r="9" fill={skin} />
        </>
      )}
    </g>
  );
}

export default function Splash({ onStart }) {
  const [leaving, setLeaving] = useState(false);

  function start() {
    setLeaving(true);
    setTimeout(onStart, 400);
  }

  return (
    <div className={`splash${leaving ? " leaving" : ""}`}>
      <div className="splash-copy">
        <h1>Kindred</h1>
        <p>Advice for the people you live with, love, and grow alongside.</p>
        <button onClick={start}>Start a conversation</button>
      </div>

      <div className="splash-art">
        <svg
          viewBox="0 0 800 420"
          preserveAspectRatio="xMidYMax slice"
          role="img"
          aria-label="Neighbours sitting together under a tree in a shared compound"
        >
          <rect width="800" height="420" fill="var(--sky)" />

          {/* stars (night mode only) */}
          {[
            [80, 40],
            [160, 95],
            [250, 50],
            [480, 60],
            [700, 36],
            [740, 110],
          ].map(([cx, cy]) => (
            <circle
              key={cx}
              cx={cx}
              cy={cy}
              r="2"
              fill="#fff"
              style={{ opacity: "var(--star)" }}
            />
          ))}

          {/* sun or moon */}
          <circle cx="620" cy="95" r="38" fill="var(--sun)" />

          {/* hills and ground */}
          <path
            d="M0 300 Q150 235 300 290 T600 275 T800 290 V420 H0Z"
            fill="var(--hill)"
          />
          <rect y="330" width="800" height="90" fill="var(--ground)" />

          {/* left house */}
          <rect x="40" y="232" width="170" height="108" fill="var(--wall1)" />
          <polygon points="28,236 125,186 222,236" fill="var(--roof)" />
          <rect x="70" y="272" width="36" height="68" fill="var(--door)" />
          <rect x="140" y="262" width="40" height="34" fill="var(--window)" />

          {/* right house */}
          <rect x="560" y="216" width="190" height="124" fill="var(--wall2)" />
          <polygon points="546,220 655,168 764,220" fill="var(--roof)" />
          <rect x="590" y="262" width="36" height="78" fill="var(--door)" />
          <rect x="658" y="250" width="34" height="34" fill="var(--window)" />
          <rect x="702" y="250" width="30" height="34" fill="var(--window)" />

          {/* shared tree */}
          <rect x="385" y="228" width="22" height="112" fill="var(--trunk)" />
          <circle cx="396" cy="205" r="62" fill="var(--leaf1)" />
          <circle cx="350" cy="238" r="40" fill="var(--leaf2)" />
          <circle cx="444" cy="238" r="42" fill="var(--leaf2)" />

          {/* bench */}
          <rect
            x="296"
            y="322"
            width="200"
            height="8"
            rx="2"
            fill="var(--bench)"
          />
          <rect x="310" y="330" width="6" height="18" fill="var(--bench)" />
          <rect x="476" y="330" width="6" height="18" fill="var(--bench)" />

          {/* people on the bench */}
          <Person x={324} y={322} shirt="#f2b632" skin="#6b4426" />
          <Person x={358} y={322} shirt="#2f8f74" skin="#8d5a36" />
          <Person x={436} y={322} shirt="#d9694f" skin="#5a371f" />
          <Person x={470} y={322} shirt="#4f7fd0" skin="#7a4a2b" />

          {/* standing neighbours */}
          <Person x={262} y={342} shirt="#c0568a" skin="#5a371f" standing />
          <Person
            x={286}
            y={342}
            shirt="#f2b632"
            skin="#7a4a2b"
            scale={0.62}
            standing
          />
          <Person x={520} y={342} shirt="#2f8f74" skin="#6b4426" standing />

          {/* plants */}
          <ellipse cx="236" cy="338" rx="14" ry="10" fill="var(--leaf2)" />
          <ellipse cx="540" cy="338" rx="12" ry="9" fill="var(--leaf1)" />
        </svg>
      </div>
    </div>
  );
}

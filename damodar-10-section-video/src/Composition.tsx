import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const sections = [
  {
    number: "01",
    title: "Damodar House of Dance",
    kicker: "A place where movement becomes presence",
    tone: "#f4d35e",
    accent: "#1f8a70",
  },
  {
    number: "02",
    title: "Foundations",
    kicker: "Posture, rhythm, balance, and clean technique",
    tone: "#e84855",
    accent: "#f9dc5c",
  },
  {
    number: "03",
    title: "Classical Grace",
    kicker: "Expression-led training with disciplined lines",
    tone: "#b388eb",
    accent: "#44ffd2",
  },
  {
    number: "04",
    title: "Bollywood Energy",
    kicker: "High-impact choreography with stage-ready polish",
    tone: "#ff9f1c",
    accent: "#2ec4b6",
  },
  {
    number: "05",
    title: "Contemporary Flow",
    kicker: "Fluid transitions, floor work, and emotional phrasing",
    tone: "#57cc99",
    accent: "#c7f9cc",
  },
  {
    number: "06",
    title: "Kids Batches",
    kicker: "Confident, joyful movement for young dancers",
    tone: "#4cc9f0",
    accent: "#f72585",
  },
  {
    number: "07",
    title: "Fitness Through Dance",
    kicker: "Sweat, stamina, musicality, and full-body motion",
    tone: "#ff6b6b",
    accent: "#ffe66d",
  },
  {
    number: "08",
    title: "Wedding Choreography",
    kicker: "Personalized routines for unforgettable celebrations",
    tone: "#f15bb5",
    accent: "#fee440",
  },
  {
    number: "09",
    title: "Stage Performance",
    kicker: "Lighting, formations, confidence, and crowd connection",
    tone: "#00bbf9",
    accent: "#9b5de5",
  },
  {
    number: "10",
    title: "Join The Floor",
    kicker: "Book a trial class and begin your dance story",
    tone: "#ffd166",
    accent: "#06d6a0",
  },
];

const sectionLength = 150;

const container: React.CSSProperties = {
  backgroundColor: "#080808",
  color: "white",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  overflow: "hidden",
};

const full: React.CSSProperties = {
  position: "absolute",
  inset: 0,
};

const bars = Array.from({ length: 16 });

const SectionCard: React.FC<{
  section: (typeof sections)[number];
  index: number;
}> = ({ section, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame;
  const intro = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
  });
  const outro = interpolate(localFrame, [sectionLength - 28, sectionLength], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = interpolate(localFrame, [0, sectionLength], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textX = interpolate(intro, [0, 1], [-95, 0]);
  const panelScale = interpolate(intro, [0, 1], [0.92, 1]);
  const opacity = intro * outro;
  const spin = interpolate(localFrame, [0, sectionLength], [-6, 8]);
  const isFinal = index === sections.length - 1;

  return (
    <AbsoluteFill style={{ ...container, opacity }}>
      <div
        style={{
          ...full,
          background: `radial-gradient(circle at ${20 + index * 7}% 20%, ${section.tone}44, transparent 29%), linear-gradient(135deg, #050505 0%, #161616 48%, #050505 100%)`,
        }}
      />
      <div
        style={{
          ...full,
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "86px 86px",
          transform: `translateX(${-progress * 86}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 88,
          width: 230,
          height: 230,
          borderRadius: 22,
          background: "rgba(255,255,255,0.92)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 28px 80px rgba(0,0,0,0.38)",
          transform: `scale(${panelScale})`,
        }}
      >
        <Img
          src={staticFile("damodar-house-of-dance-logo.png")}
          style={{
            width: 190,
            height: 190,
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: -160,
          top: 80,
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: `42px solid ${section.tone}`,
          opacity: 0.2,
          transform: `rotate(${spin}deg) scale(${1 + progress * 0.08})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 138,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${section.accent}, transparent)`,
          opacity: 0.16,
          filter: "blur(4px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 112,
          right: 112,
          bottom: 104,
          height: 8,
          background: "rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${section.tone}, ${section.accent})`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 112,
          top: 384,
          width: 1180,
          transform: `translateX(${textX}px)`,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 0,
            color: section.tone,
            marginBottom: 28,
          }}
        >
          SECTION {section.number}
        </div>
        <div
          style={{
            fontSize: isFinal ? 118 : 104,
            lineHeight: 0.92,
            fontWeight: 950,
            letterSpacing: 0,
            maxWidth: 1120,
            textTransform: "uppercase",
          }}
        >
          {section.title}
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 43,
            lineHeight: 1.18,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 900,
            fontWeight: 500,
          }}
        >
          {section.kicker}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 118,
          bottom: 166,
          display: "flex",
          gap: 12,
          alignItems: "flex-end",
          height: 190,
        }}
      >
        {bars.map((_, barIndex) => {
          const height = interpolate(
            Math.sin((localFrame + barIndex * 8) / 10),
            [-1, 1],
            [48, 180],
          );
          return (
            <div
              key={barIndex}
              style={{
                width: 18,
                height,
                background: barIndex % 2 === 0 ? section.tone : section.accent,
                opacity: 0.78,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <AbsoluteFill style={container}>
      {sections.map((section, index) => (
        <Sequence
          key={section.number}
          from={index * sectionLength}
          durationInFrames={sectionLength}
        >
          <SectionCard section={section} index={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

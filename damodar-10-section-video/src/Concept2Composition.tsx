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

const INK = "#101114";
const PAPER = "#f7f0e2";
const MUTED = "#b9af9d";

const sections = [
  {
    number: "01",
    title: "Dance Create Perform",
    kicker: "Bengaluru's creator-led dance studio",
    tone: "#d5a64f",
    accent: "#d85a43",
  },
  {
    number: "02",
    title: "Hip-Hop",
    kicker: "Old-school foundations, new-gen grooves, freestyle drills",
    tone: "#d85a43",
    accent: "#d5a64f",
  },
  {
    number: "03",
    title: "Contemporary & Bollywood",
    kicker: "Fluid movement, floorwork, and expressive storytelling",
    tone: "#23b36b",
    accent: "#d5a64f",
  },
  {
    number: "04",
    title: "Freestyle Choreography",
    kicker: "Camera-ready combinations across all genres",
    tone: "#d5a64f",
    accent: "#23b36b",
  },
  {
    number: "05",
    title: "Kids Groovezone",
    kicker: "Fun introduction to dance for young movers, age 5–10",
    tone: "#d5a64f",
    accent: "#d85a43",
  },
  {
    number: "06",
    title: "The Stage",
    kicker: "Battles, formations, confidence, and stagecraft",
    tone: "#d85a43",
    accent: "#23b36b",
  },
  {
    number: "07",
    title: "Workshops",
    kicker: "Monthly guest sessions across styles and skills",
    tone: "#23b36b",
    accent: "#d5a64f",
  },
  {
    number: "08",
    title: "Meet The Team",
    kicker: "Arjun, Priya & Kiran — working artists who teach",
    tone: "#d5a64f",
    accent: "#d85a43",
  },
  {
    number: "09",
    title: "Class Schedule",
    kicker: "Morning, evening, and weekend batches available",
    tone: "#23b36b",
    accent: "#d5a64f",
  },
  {
    number: "10",
    title: "Book A Free Demo",
    kicker: "Step into the studio. Begin your dance story.",
    tone: "#d5a64f",
    accent: "#23b36b",
  },
];

const sectionLength = 150;

const bars = Array.from({ length: 14 });

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
    config: { damping: 20, stiffness: 130 },
  });
  const outro = interpolate(localFrame, [sectionLength - 28, sectionLength], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = interpolate(localFrame, [0, sectionLength], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textX = interpolate(intro, [0, 1], [-80, 0]);
  const logoScale = interpolate(intro, [0, 1], [0.88, 1]);
  const opacity = intro * outro;
  const spin = interpolate(localFrame, [0, sectionLength], [-4, 6]);
  const isFinal = index === sections.length - 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: INK,
        color: "white",
        fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
        overflow: "hidden",
        opacity,
      }}
    >
      {/* Warm radial gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at ${15 + index * 8}% 30%, ${section.tone}30, transparent 55%)`,
        }}
      />

      {/* Grid pattern — warm gold lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(90deg, ${section.tone}18 1px, transparent 1px), linear-gradient(0deg, ${section.tone}10 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          transform: `translateX(${-progress * 72}px)`,
        }}
      />

      {/* Left gold stripe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: `linear-gradient(180deg, ${section.tone}, ${section.accent})`,
          opacity: 0.9,
        }}
      />

      {/* Logo panel — cream background */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 72,
          width: 210,
          height: 210,
          borderRadius: 18,
          backgroundColor: PAPER,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 2px ${section.tone}66`,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={staticFile("damodar-house-of-dance-logo.png")}
          style={{ width: 172, height: 172, objectFit: "contain" }}
        />
      </div>

      {/* Spinning ring — top right */}
      <div
        style={{
          position: "absolute",
          right: -180,
          top: 60,
          width: 680,
          height: 680,
          borderRadius: "50%",
          border: `38px solid ${section.tone}`,
          opacity: 0.18,
          transform: `rotate(${spin}deg) scale(${1 + progress * 0.07})`,
        }}
      />

      {/* Accent blob — bottom right */}
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 100,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${section.accent}44, transparent 70%)`,
          filter: "blur(6px)",
        }}
      />

      {/* Progress bar — bottom */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 80,
          height: 6,
          backgroundColor: `${PAPER}22`,
          borderRadius: 3,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 3,
            background: `linear-gradient(90deg, ${section.tone}, ${section.accent})`,
          }}
        />
      </div>

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 336,
          width: 1160,
          transform: `translateX(${textX}px)`,
        }}
      >
        {/* Section number eyebrow */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 6,
            color: section.tone,
            textTransform: "uppercase",
            marginBottom: 22,
            opacity: 0.9,
          }}
        >
          SECTION {section.number} &nbsp;/&nbsp; DAMODAR HOUSE OF DANCE
        </div>

        {/* Main title — Anton font */}
        <div
          style={{
            fontFamily: '"Anton", "Impact", sans-serif',
            fontSize: isFinal ? 122 : 106,
            lineHeight: 0.9,
            fontWeight: 400,
            letterSpacing: 1,
            textTransform: "uppercase",
            maxWidth: 1100,
            color: "white",
          }}
        >
          {section.title}
        </div>

        {/* Gold underline accent */}
        <div
          style={{
            marginTop: 28,
            width: interpolate(intro, [0, 1], [0, 320]),
            height: 3,
            background: `linear-gradient(90deg, ${section.tone}, transparent)`,
          }}
        />

        {/* Kicker — Playfair italic */}
        <div
          style={{
            marginTop: 26,
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontStyle: "italic",
            fontSize: 38,
            lineHeight: 1.22,
            color: MUTED,
            maxWidth: 860,
          }}
        >
          {section.kicker}
        </div>
      </div>

      {/* Animated bars — right side */}
      <div
        style={{
          position: "absolute",
          right: 100,
          bottom: 140,
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          height: 180,
        }}
      >
        {bars.map((_, i) => {
          const h = interpolate(Math.sin((localFrame + i * 9) / 10), [-1, 1], [40, 160]);
          return (
            <div
              key={i}
              style={{
                width: 16,
                height: h,
                background: i % 2 === 0 ? section.tone : section.accent,
                opacity: 0.72,
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Concept2Composition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {sections.map((section, index) => (
        <Sequence key={section.number} from={index * sectionLength} durationInFrames={sectionLength}>
          <SectionCard section={section} index={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

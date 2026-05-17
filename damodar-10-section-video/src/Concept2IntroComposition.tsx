import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
} from "remotion";
import { CONCEPT2_PAGE_HEIGHT, CONCEPT2_SECTIONS } from "./concept2-meta";

export const INTRO_FPS = 30;
export const INTRO_WIDTH = 1920;
export const INTRO_HEIGHT = 1080;

// Per-section durations in frames (sum to 300 = 10s @ 30fps)
const SHOT_FRAMES: Record<string, number> = {
  home: 60, // 2.0s — establishing hero
  space: 36, // 1.2s
  classes: 48, // 1.6s — longer for variety of classes
  coaches: 36, // 1.2s
  schedule: 36, // 1.2s
  reviews: 30, // 1.0s
  contact: 54, // 1.8s — CTA, hold longer
};

const CROSSFADE_FRAMES = 8;

type Shot = {
  section: (typeof CONCEPT2_SECTIONS)[number];
  start: number;
  duration: number;
};

const buildShots = (): Shot[] => {
  let cursor = 0;
  return CONCEPT2_SECTIONS.map((section) => {
    const duration = SHOT_FRAMES[section.id] ?? 36;
    const shot: Shot = { section, start: cursor, duration };
    cursor += duration;
    return shot;
  });
};

export const SHOTS = buildShots();
export const concept2IntroDurationInFrames = SHOTS.reduce(
  (acc, s) => acc + s.duration,
  0,
);

const PAPER = "#f7f0e2";
const GOLD = "#d5a64f";
const INK = "#101114";

const Shot: React.FC<{ shot: Shot; shotIndex: number }> = ({
  shot,
  shotIndex,
}) => {
  const frame = useCurrentFrame();
  const local = frame - shot.start;
  const t = Math.min(1, Math.max(0, local / shot.duration));

  // Opacity envelope, computed in global frame space.
  // First shot is visible at frame 0; last shot stays visible to the end.
  const fadeInStart = shotIndex === 0 ? 0 : shot.start - CROSSFADE_FRAMES;
  const fadeInEnd = shotIndex === 0 ? 0 : shot.start + CROSSFADE_FRAMES;
  const fadeOutStart =
    shotIndex === SHOTS.length - 1
      ? shot.start + shot.duration
      : shot.start + shot.duration - CROSSFADE_FRAMES;
  const fadeOutEnd =
    shotIndex === SHOTS.length - 1
      ? shot.start + shot.duration
      : shot.start + shot.duration + CROSSFADE_FRAMES;

  const fadeIn =
    shotIndex === 0
      ? 1
      : interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const fadeOut =
    shotIndex === SHOTS.length - 1
      ? 1
      : interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const opacity = Math.min(fadeIn, fadeOut);
  if (opacity <= 0) return null;

  // Ken Burns: zoom 1.08 → 1.0 with slow easing
  const scale = interpolate(t, [0, 1], [1.08, 1.0], {
    easing: Easing.out(Easing.cubic),
  });

  // Slight downward pan over the shot (parallax feel)
  const panY = interpolate(t, [0, 1], [-20, 20]);

  // Compute the y-translate needed to center this section in the 1080 viewport.
  // The image is rendered at native CONCEPT2_PAGE_WIDTH = 1920 (no horizontal scale).
  const focusY = shot.section.top + shot.section.height / 2;
  const baseTranslateY = INTRO_HEIGHT / 2 - focusY;

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: INK, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: INTRO_WIDTH,
          height: CONCEPT2_PAGE_HEIGHT,
          transform: `translateY(${baseTranslateY + panY}px) scale(${scale})`,
          transformOrigin: `50% ${focusY}px`,
        }}
      >
        <Img
          src={staticFile("concept2-fullpage.png")}
          style={{
            display: "block",
            width: INTRO_WIDTH,
            height: CONCEPT2_PAGE_HEIGHT,
          }}
        />
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Section label — bottom-left, slides up */}
      <SectionLabel
        index={shotIndex}
        total={SHOTS.length}
        label={shot.section.label}
        local={local}
        duration={shot.duration}
      />
    </AbsoluteFill>
  );
};

const SectionLabel: React.FC<{
  index: number;
  total: number;
  label: string;
  local: number;
  duration: number;
}> = ({ index, total, label, local, duration }) => {
  // Label intro: 0 → 12 frames
  const labelIn = interpolate(local, [4, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Label outro
  const labelOut = interpolate(
    local,
    [duration - 14, duration - 6],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const labelOpacity = labelIn * labelOut;
  const labelY = interpolate(labelIn, [0, 1], [40, 0]);

  return (
    <>
      {/* Bottom-left card */}
      <div
        style={{
          position: "absolute",
          left: 80,
          bottom: 90,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            width: 6,
            height: 76,
            background: `linear-gradient(180deg, ${GOLD}, transparent)`,
          }}
        />
        <div>
          <div
            style={{
              color: GOLD,
              fontFamily: '"Inter", sans-serif',
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 5,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div
            style={{
              color: PAPER,
              fontFamily: '"Anton", "Impact", sans-serif',
              fontSize: 64,
              lineHeight: 1,
              letterSpacing: 1,
              textTransform: "uppercase",
              textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            }}
          >
            {label}
          </div>
        </div>
      </div>

      {/* Top-right brand */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 60,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            backgroundColor: PAPER,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 0 2px ${GOLD}66, 0 10px 28px rgba(0,0,0,0.5)`,
          }}
        >
          <Img
            src={staticFile("damodar-house-of-dance-logo.png")}
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            color: PAPER,
            fontFamily: '"Anton", "Impact", sans-serif',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            textShadow: "0 2px 14px rgba(0,0,0,0.7)",
          }}
        >
          Damodar
        </div>
      </div>
    </>
  );
};

export const Concept2IntroComposition: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {SHOTS.map((shot, i) => (
        <Shot key={shot.section.id} shot={shot} shotIndex={i} />
      ))}
    </AbsoluteFill>
  );
};

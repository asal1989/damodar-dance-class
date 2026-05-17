import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { CONCEPT2_PAGE_WIDTH, CONCEPT2_PAGE_HEIGHT } from "./concept2-meta";

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

// Pace: ~900px per second of vertical scroll. Calculated from the actual page height.
const SCROLL_PIXELS_PER_SECOND = 900;
const HOLD_AT_TOP_SECONDS = 1.2;
const HOLD_AT_BOTTOM_SECONDS = 1.5;

const scaledImageHeight =
  (CONCEPT2_PAGE_HEIGHT * VIDEO_WIDTH) / CONCEPT2_PAGE_WIDTH;
const scrollDistance = Math.max(0, scaledImageHeight - VIDEO_HEIGHT);

export const concept2ScrollDurationInFrames = Math.ceil(
  (HOLD_AT_TOP_SECONDS +
    scrollDistance / SCROLL_PIXELS_PER_SECOND +
    HOLD_AT_BOTTOM_SECONDS) *
    FPS,
);

export const Concept2ScrollComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const holdTopFrames = HOLD_AT_TOP_SECONDS * fps;
  const holdBottomFrames = HOLD_AT_BOTTOM_SECONDS * fps;
  const scrollStartFrame = holdTopFrames;
  const scrollEndFrame = durationInFrames - holdBottomFrames;

  const y = interpolate(
    frame,
    [scrollStartFrame, scrollEndFrame],
    [0, -scrollDistance],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#101114", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: VIDEO_WIDTH,
          transform: `translateY(${y}px)`,
        }}
      >
        <Img
          src={staticFile("concept2-fullpage.png")}
          style={{
            display: "block",
            width: VIDEO_WIDTH,
            height: scaledImageHeight,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

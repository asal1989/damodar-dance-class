import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { Concept2Composition } from "./Concept2Composition";
import {
  Concept2ScrollComposition,
  concept2ScrollDurationInFrames,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  FPS,
} from "./Concept2ScrollComposition";
import {
  Concept2IntroComposition,
  concept2IntroDurationInFrames,
  INTRO_WIDTH,
  INTRO_HEIGHT,
  INTRO_FPS,
} from "./Concept2IntroComposition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DamodarTenSectionPromo"
        component={MyComposition}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DamodarConcept2Promo"
        component={Concept2Composition}
        durationInFrames={1500}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DamodarConcept2WebsiteScroll"
        component={Concept2ScrollComposition}
        durationInFrames={concept2ScrollDurationInFrames}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="DamodarConcept2Intro"
        component={Concept2IntroComposition}
        durationInFrames={concept2IntroDurationInFrames}
        fps={INTRO_FPS}
        width={INTRO_WIDTH}
        height={INTRO_HEIGHT}
      />
    </>
  );
};

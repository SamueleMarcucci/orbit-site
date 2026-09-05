import { assetPath } from "@/lib/site";

export function PhoneFrame({ screen = "earth", eager = false, className = "" }: { screen?: "earth" | "passes"; eager?: boolean; className?: string }) {
  const widths = screen === "earth" ? [800, 1440, 2200] : [440, 880, 1242];
  return (
    <div className={`phone-frame phone-frame-${screen} ${className}`}>
      {/* Native picture sources keep the supplied artwork intact, including its device frame. */}
      <picture>
        <source srcSet={widths.map(width => `${assetPath(`/assets/september/${screen}-${width}.webp`)} ${width}w`).join(", ")} sizes={screen === "earth" ? "(max-width: 700px) 150vw, 1000px" : "(max-width: 700px) 70vw, 540px"} type="image/webp" />
        
        <img src={assetPath(`/assets/september/${screen}-${widths[1]}.webp`)} width={screen === "earth" ? 2602 : 1242} height={screen === "earth" ? 3253 : 2688} alt={screen === "earth" ? "Live Orbit on iPhone, with satellites surrounding Earth" : "Live Orbit pass planning, with maps, visibility, and timing"} loading={eager ? "eager" : "lazy"} fetchPriority={eager && screen === "earth" ? "high" : undefined} decoding="async" />
      </picture>
    </div>
  );
}

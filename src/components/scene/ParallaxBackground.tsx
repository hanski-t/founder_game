import type { SceneBackgroundLayer } from '../../types/scene';

interface ParallaxBackgroundProps {
  layers: SceneBackgroundLayer[];
  ambientColor?: string;
}

export function ParallaxBackground({ layers, ambientColor }: ParallaxBackgroundProps) {
  return (
    <>
      {layers.map((layer, index) => (
        <img
          key={index}
          src={layer.src}
          alt=""
          className="scene-background-layer"
          style={{
            zIndex: index,
            filter: ambientColor || undefined,
          }}
          draggable={false}
        />
      ))}
    </>
  );
}

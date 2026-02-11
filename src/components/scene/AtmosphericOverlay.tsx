import { usePhaseConfig } from '../../hooks/usePhaseConfig';

export function AtmosphericOverlay() {
  const phaseConfig = usePhaseConfig();
  const overlay = phaseConfig.overlay;
  if (!overlay || overlay === 'none') return null;

  return <div className={`atmosphere-overlay atmosphere-${overlay}`} />;
}

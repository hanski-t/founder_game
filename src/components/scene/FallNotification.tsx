import { useEffect, useRef } from 'react';

interface FallNotificationProps {
  onComplete: () => void;
}

export function FallNotification({ onComplete }: FallNotificationProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fall-notification">
      <div className="fall-notification-penalty">-5% Momentum</div>
      <div className="fall-notification-text">Restarting from beginning...</div>
    </div>
  );
}

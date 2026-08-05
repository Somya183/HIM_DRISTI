import { useState } from 'react';

export function useMoonClick() {
  const [selectedMoon, setSelectedMoon] = useState(null);

  const handleMoonClick = (moon) => {
    setSelectedMoon(moon);
  };

  return { selectedMoon, handleMoonClick };
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { FortuneWheel } from './components/fortune-wheel';

const fortuneWheelContainer = document.getElementById('wfw-fortune-wheel');

if (fortuneWheelContainer) {
  const root = createRoot(fortuneWheelContainer);
  
  const prizes = (window as any).wfwData.prizes || [];
  const probabilities = (window as any).wfwData.probabilities || [];
  const texts = (window as any).wfwData.texts || {};

  root.render(
    <React.StrictMode>
      <FortuneWheel prizes={prizes} probabilities={probabilities} texts={texts} />
    </React.StrictMode>
  );
}


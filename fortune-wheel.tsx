import React, { useState } from 'react';
import { Wheel } from './wheel';

interface FortuneWheelProps {
  prizes: string[];
  probabilities: number[];
  texts: {
    title: string;
    question: string;
    yesButton: string;
    noButton: string;
    formTitle: string;
    submitButton: string;
    winTitle: string;
    claimButton: string;
    notInterested: string;
  };
}

export const FortuneWheel: React.FC<FortuneWheelProps> = ({ prizes, probabilities, texts }) => {
  const [step, setStep] = useState<'question' | 'form' | 'spin' | 'win'>('question');
  const [selectedPrize, setSelectedPrize] = useState('');

  const handleDriverLicense = (hasLicense: boolean) => {
    if (hasLicense) {
      alert('Спасибо за проявленный интерес, но призы фортуны вам не актуальны');
      setStep('question');
    } else {
      setStep('form');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep('spin');
  };

  const handleSpin = (prize: string) => {
    setSelectedPrize(prize);
    setStep('win');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">{texts.title}</h2>
      {step === 'question' && (
        <div>
          <p className="mb-4 text-center">{texts.question}</p>
          <div className="flex justify-center space-x-4">
            <button onClick={() => handleDriverLicense(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
              {texts.yesButton}
            </button>
            <button onClick={() => handleDriverLicense(false)} className="bg-blue-500 text-white px-4 py-2 rounded">
              {texts.noButton}
            </button>
          </div>
        </div>
      )}
      {step === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">{texts.formTitle}</h3>
          <input type="text" placeholder="Ваше имя" required className="w-full p-2 border rounded" />
          <input type="tel" placeholder="Ваш номер телефона" required className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">
            {texts.submitButton}
          </button>
        </form>
      )}
      {step === 'spin' && <Wheel prizes={prizes} probabilities={probabilities} onSpin={handleSpin} />}
      {step === 'win' && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">{texts.winTitle}</h3>
          <p className="mb-4">Вы выиграли: {selectedPrize}</p>
          <button onClick={() => setStep('question')} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
            {texts.claimButton}
          </button>
          <br />
          <button onClick={() => setStep('question')} className="text-sm text-gray-500">
            {texts.notInterested}
          </button>
        </div>
      )}
    </div>
  );
};


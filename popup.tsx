"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Wheel } from "./wheel"

interface PopupProps {
  prizes: string[]
  texts: {
    title: string
    question: string
    yesButton: string
    noButton: string
    formTitle: string
    submitButton: string
    winTitle: string
    claimButton: string
    notInterested: string
  }
}

export function FortunePopup({ prizes, texts }: PopupProps) {
  const [step, setStep] = useState<"question" | "form" | "win" | null>("question")
  const [selectedPrize, setSelectedPrize] = useState("")
  
  const handleDriverLicense = (hasLicense: boolean) => {
    if (hasLicense) {
      alert("Спасибо за проявленный интерес, но призы фортуны вам не актуальны")
      setStep(null)
    } else {
      setStep("form")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const response = await fetch(window.wfwData.ajaxUrl, {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        setSelectedPrize(prizes[Math.floor(Math.random() * prizes.length)])
        setStep("win")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <AnimatePresence>
      {step && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <Wheel prizes={prizes} onWin={setSelectedPrize} />
            
            <AnimatePresence mode="wait">
              {step === "question" && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 text-center"
                >
                  <h2 className="text-xl font-bold mb-4">{texts.question}</h2>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleDriverLicense(true)}
                      className="px-6 py-2 bg-pink-200 rounded-md"
                    >
                      {texts.yesButton}
                    </button>
                    <button
                      onClick={() => handleDriverLicense(false)}
                      className="px-6 py-2 bg-pink-200 rounded-md"
                    >
                      {texts.noButton}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "form" && (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 space-y-4"
                  onSubmit={handleSubmit}
                >
                  <h2 className="text-xl font-bold text-center">{texts.formTitle}</h2>
                  <input
                    type="text"
                    name="name"
                    placeholder="ВАШЕ ИМЯ"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="ВАШ НОМЕР ТЕЛЕФОНА"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" required />
                    <span className="text-sm">Я СОГЛАСЕН НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
                  </label>
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white rounded-md"
                  >
                    {texts.submitButton}
                  </button>
                </motion.form>
              )}

              {step === "win" && (
                <motion.div
                  key="win"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 text-center"
                >
                  <h2 className="text-xl font-bold mb-4">{texts.winTitle}</h2>
                  <p className="mb-4">ВЫ ВЫИГРАЛИ {selectedPrize}</p>
                  <button
                    onClick={() => setStep(null)}
                    className="w-full py-2 bg-red-600 text-white rounded-md mb-2"
                  >
                    {texts.claimButton}
                  </button>
                  <button
                    onClick={() => setStep(null)}
                    className="text-sm text-gray-500"
                  >
                    {texts.notInterested}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  exit: { opacity: 0 },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AutoHeight = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setHeight(el.getBoundingClientRect().height);

    const ro = new ResizeObserver(() => {
      const next = el.getBoundingClientRect().height;
      setHeight(next);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <motion.div
      animate={{ height }}
      initial={false}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};

export function OnboardingCard() {
  const maxSteps = 3;

  const [currentStep, setCurrentStep] = useState(0);
  const [showStepper, setShowStepper] = useState(false);

  const nextStep = () => {
    if (currentStep < maxSteps - 1) setCurrentStep((s) => s + 1);
    else console.log('Onboarding complete!');
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    if (currentStep === 0) setShowStepper(false);
  }, [currentStep]);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <AutoHeight>
        <AnimatePresence>
          {showStepper && (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6 pt-4"
            >
              <div className="flex items-center gap-2">{currentStep}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence
          mode="wait"
          onExitComplete={() => {
            if (currentStep > 0) setShowStepper(true);
          }}
        >
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={container}
            className="flex flex-col gap-6"
          >
            {currentStep === 0 && <WelcomeStep nextStep={nextStep} item={item} />}
            {currentStep === 1 && (
              <OnboardingStep1 nextStep={nextStep} prevStep={prevStep} item={item} />
            )}
          </motion.div>
        </AnimatePresence>
      </AutoHeight>
    </Card>
  );
}

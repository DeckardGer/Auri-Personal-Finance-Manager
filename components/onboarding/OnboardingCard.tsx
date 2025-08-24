'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3';
import { OnboardingStep4 } from '@/components/onboarding/OnboardingStep4';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/stepper';
import { Check } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  exit: { opacity: 0 },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function AutoHeight({ children }: { children: React.ReactNode }) {
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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

const steps = [0, 1, 2, 3, 4];

export function OnboardingCard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStepper, setShowStepper] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
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
              className="px-6 pb-6"
            >
              <Stepper
                value={currentStep}
                onValueChange={setCurrentStep}
                indicators={{ completed: <Check className="size-4" /> }}
                className="space-y-8"
              >
                <StepperNav>
                  {steps.map((step) => (
                    <StepperItem key={step} step={step}>
                      <StepperTrigger asChild>
                        <StepperIndicator className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:text-gray-500">
                          {step + 1}
                        </StepperIndicator>
                      </StepperTrigger>
                      {steps.length > step && (
                        <StepperSeparator className="group-data-[state=completed]/step:bg-green-500" />
                      )}
                    </StepperItem>
                  ))}
                </StepperNav>
              </Stepper>
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
            {currentStep === 2 && (
              <OnboardingStep2 nextStep={nextStep} prevStep={prevStep} item={item} />
            )}
            {currentStep === 3 && (
              <OnboardingStep3 nextStep={nextStep} prevStep={prevStep} item={item} />
            )}
            {currentStep === 4 && (
              <OnboardingStep4 nextStep={nextStep} prevStep={prevStep} item={item} />
            )}
          </motion.div>
        </AnimatePresence>
      </AutoHeight>
    </Card>
  );
}

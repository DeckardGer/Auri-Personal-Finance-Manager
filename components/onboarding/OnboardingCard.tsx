'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3';
import { OnboardingStep4 } from '@/components/onboarding/OnboardingStep4';
import { defineStepper } from '@/components/ui/stepper';
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

const { Stepper } = defineStepper(
  { id: 'step-1', step: 1 },
  { id: 'step-2', step: 2 },
  { id: 'step-3', step: 3 },
  { id: 'step-4', step: 4 },
  { id: 'step-5', step: 5 }
);

export function OnboardingCard() {
  const [showStepper, setShowStepper] = useState(false);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <Stepper.Provider>
        {({ methods }) => (
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
                  <Stepper.Navigation>
                    {methods.all.map((step) => (
                      <Stepper.Step
                        key={step.id}
                        of={step.id}
                        icon={
                          step.step < methods.current.step ? (
                            <Check className="size-4" />
                          ) : undefined
                        }
                        className="data-[state=completed]:bg-green-500 data-[state=completed]:text-white data-[state=inactive]:text-gray-500"
                      />
                    ))}
                  </Stepper.Navigation>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence
              mode="wait"
              onExitComplete={() => {
                if (!methods.isFirst) setShowStepper(true);
              }}
            >
              <motion.div
                key={methods.current.id}
                initial="hidden"
                animate="show"
                exit="exit"
                variants={container}
                className="flex flex-col gap-6"
              >
                {methods.switch({
                  'step-1': () => <WelcomeStep nextStep={methods.next} item={item} />,
                  'step-2': () => (
                    <OnboardingStep1
                      nextStep={methods.next}
                      prevStep={() => {
                        methods.beforePrev(() => {
                          setShowStepper(false);
                          return true;
                        });
                        methods.prev();
                      }}
                      item={item}
                    />
                  ),
                  'step-3': () => (
                    <OnboardingStep2 nextStep={methods.next} prevStep={methods.prev} item={item} />
                  ),
                  'step-4': () => (
                    <OnboardingStep3 nextStep={methods.next} prevStep={methods.prev} item={item} />
                  ),
                  'step-5': () => (
                    <OnboardingStep4 nextStep={methods.next} prevStep={methods.prev} item={item} />
                  ),
                })}
              </motion.div>
            </AnimatePresence>
          </AutoHeight>
        )}
      </Stepper.Provider>
    </Card>
  );
}

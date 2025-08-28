'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1';
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2';
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3';
import { OnboardingCompleteStep } from '@/components/onboarding/OnboardingCompleteStep';
import { defineStepper } from '@/components/ui/stepper';
import { Check } from 'lucide-react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { completeOnboarding } from '@/actions/onboarding';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  exit: { opacity: 0 },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const { Stepper } = defineStepper(
  { id: 'step-1', step: 1 },
  { id: 'step-2', step: 2 },
  { id: 'step-3', step: 3 },
  { id: 'step-4', step: 4 },
  { id: 'step-5', step: 5 }
);

export function OnboardingCard() {
  const [showStepper, setShowStepper] = useState(false);
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const { getCurrentState } = useOnboardingStore();

  const completeOnboardingForm = async () => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      await completeOnboarding(getCurrentState());
      await minDelay;
      setState('success');
    } catch (error) {
      await minDelay;
      console.error(error);
      setState('error');

      toast.error('Account creation failed', {
        description: 'An error occurred while creating your account',
        action: {
          label: 'Retry',
          onClick: () => {
            setState('loading');
            completeOnboardingForm();
          },
        },
        duration: Infinity,
      });
    }
  };

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
                    {methods.all.slice(0, -1).map((step) => (
                      <Stepper.Step
                        key={step.id}
                        of={step.id}
                        icon={
                          step.step < methods.current.step ? (
                            <Check className="size-4" />
                          ) : undefined
                        }
                        isLast={step.step === methods.all.length - 1 || undefined}
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
                    <OnboardingStep3
                      nextStep={() => {
                        methods.next();
                        completeOnboardingForm();
                      }}
                      prevStep={methods.prev}
                      item={item}
                    />
                  ),
                  'step-5': () => <OnboardingCompleteStep item={item} state={state} />,
                })}
              </motion.div>
            </AnimatePresence>
          </AutoHeight>
        )}
      </Stepper.Provider>
    </Card>
  );
}

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

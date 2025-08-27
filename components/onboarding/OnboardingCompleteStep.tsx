'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

export function OnboardingCompleteStep({
  item,
  prevStep,
}: {
  item: Variants;
  prevStep: () => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CardContent>
      <motion.div variants={item}>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="onboarding-loader" />
          </div>
        ) : (
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <motion.svg className="absolute h-full w-full" viewBox="0 0 50 50" fill="none">
              <motion.circle
                cx="25"
                cy="25"
                r="22"
                stroke="var(--color-success)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
              />
            </motion.svg>
            <motion.svg key="tick" className="relative h-3/4 w-3/4" viewBox="0 0 50 50" fill="none">
              <motion.path
                d="M15 25L22 32L35 18"
                stroke="var(--color-success)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
              />
            </motion.svg>
          </div>
        )}
      </motion.div>
      <motion.div variants={item}>
        <h2 className="mt-6 text-center font-semibold">Getting things ready ✨</h2>
      </motion.div>
      <motion.div variants={item}>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          We&apos;re setting up your data behind the scenes so you can jump right in.
        </p>
      </motion.div>
      <motion.div variants={item}>
        <Button className="w-full" onClick={prevStep}>
          Back
        </Button>
      </motion.div>
    </CardContent>
  );
}

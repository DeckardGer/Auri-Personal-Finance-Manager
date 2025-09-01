'use client';

import { motion, Variants } from 'motion/react';
import { CardContent } from '@/components/ui/card';

export function OnboardingCompleteStep({
  item,
  state,
}: {
  item: Variants;
  state: 'loading' | 'success' | 'error';
}) {
  return (
    <CardContent>
      <motion.div variants={item}>
        {state === 'loading' ? (
          <div className="flex items-center justify-center">
            <div className="onboarding-loader" />
          </div>
        ) : state === 'success' ? (
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
        ) : state === 'error' ? (
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <motion.svg className="absolute h-full w-full" viewBox="0 0 50 50" fill="none">
              <motion.circle
                cx="25"
                cy="25"
                r="22"
                stroke="var(--color-destructive)"
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
            <motion.svg
              key="cross"
              className="relative h-3/4 w-3/4"
              viewBox="0 0 50 50"
              fill="none"
            >
              <motion.path
                d="M16 16L34 34"
                stroke="var(--color-destructive)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                }}
              />
              <motion.path
                d="M34 16L16 34"
                stroke="var(--color-destructive)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: 0.1,
                }}
              />
            </motion.svg>
          </div>
        ) : null}
      </motion.div>
      <motion.div variants={item}>
        <h2 className="mt-6 text-center font-semibold">
          {state === 'loading'
            ? 'Getting things ready ✨'
            : state === 'success'
              ? 'Just a moment...'
              : 'Something went wrong'}
        </h2>
      </motion.div>
      <motion.div variants={item}>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          {state === 'loading'
            ? "We're setting up your data behind the scenes so you can jump right in."
            : state === 'success'
              ? 'You will now be redirected to your dashboard.'
              : 'There was an issue creating your account. Please try again.'}
        </p>
      </motion.div>
    </CardContent>
  );
}

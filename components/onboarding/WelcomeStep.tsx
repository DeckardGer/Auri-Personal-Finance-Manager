import Image from 'next/image';
import welcomeImage from '@/public/welcome-image.png';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, Variants } from 'motion/react';

export function WelcomeStep({ nextStep, item }: { nextStep: () => void; item: Variants }) {
  return (
    <>
      <CardHeader>
        <motion.div variants={item}>
          <CardTitle>Welcome to Auri</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>Let&apos;s set up your account to get started.</CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.div variants={item}>
          <Image
            src={welcomeImage}
            alt="Welcome"
            className="mx-auto w-7/12 object-cover"
            priority
          />
        </motion.div>
      </CardContent>

      <motion.div variants={item}>
        <CardFooter>
          <Button className="w-full" onClick={nextStep}>
            Get Started
          </Button>
        </CardFooter>
      </motion.div>
    </>
  );
}

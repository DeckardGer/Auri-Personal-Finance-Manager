import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import openai from '@/public/openai.svg';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function OnboardingStep2({
  nextStep,
  prevStep,
  item,
}: {
  nextStep: () => void;
  prevStep: () => void;
  item: Variants;
}) {
  return (
    <>
      <CardHeader>
        <motion.div variants={item}>
          <CardTitle>OpenAI API Key</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>
            We use AI for generating categories and financial insights.
          </CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <motion.div variants={item}>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Image
                      src={openai}
                      alt="OpenAI"
                      width={20}
                      height={20}
                      className="h-5 w-5 dark:invert"
                      priority
                      unoptimized
                    />
                  </div>
                  <Input
                    id="apiKey"
                    type="text"
                    placeholder="sk-..."
                    required
                    autoFocus
                    className="pl-10"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </CardContent>

      <motion.div variants={item}>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Continue</Button>
        </CardFooter>
      </motion.div>
    </>
  );
}

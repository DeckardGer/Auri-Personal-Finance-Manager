import { motion, Variants } from 'motion/react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import light from '@/public/light.png';
import dark from '@/public/dark.png';
import system from '@/public/system.png';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

export function OnboardingStep3({
  nextStep,
  prevStep,
  item,
}: {
  nextStep: () => void;
  prevStep: () => void;
  item: Variants;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <CardHeader>
        <motion.div variants={item}>
          <CardTitle>Colour Theme</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>
            Switch between light and dark themes, or let Auri use your system preferences.
          </CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <motion.div variants={item}>
              <RadioGroupPrimitive.Root
                defaultValue={theme}
                onValueChange={setTheme}
                className="flex gap-4"
              >
                <div className="flex-1 space-y-2">
                  <RadioGroupPrimitive.Item
                    className="peer w-full flex-1 overflow-hidden rounded-lg border-2 border-input ring-offset-2 ring-offset-card transition-all outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                    value="system"
                    autoFocus
                  >
                    <div className="relative h-16 w-full">
                      <Image
                        src={system}
                        alt="System"
                        fill
                        draggable={false}
                        className="object-cover transition-transform select-none group-hover:scale-110"
                      />
                    </div>
                  </RadioGroupPrimitive.Item>
                  <p className="text-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                    System
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <RadioGroupPrimitive.Item
                    className="peer w-full flex-1 overflow-hidden rounded-lg border-2 border-input ring-offset-2 ring-offset-card transition-all outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                    value="light"
                  >
                    <div className="relative h-16 w-full">
                      <Image
                        src={light}
                        alt="Light"
                        fill
                        draggable={false}
                        className="object-cover transition-transform select-none group-hover:scale-110"
                      />
                    </div>
                  </RadioGroupPrimitive.Item>
                  <p className="text-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                    Light
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <RadioGroupPrimitive.Item
                    className="peer w-full flex-1 overflow-hidden rounded-lg border-2 border-input ring-offset-2 ring-offset-card transition-all outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                    value="dark"
                  >
                    <div className="relative h-16 w-full">
                      <Image
                        src={dark}
                        alt="Dark"
                        fill
                        draggable={false}
                        className="object-cover transition-transform select-none group-hover:scale-110"
                      />
                    </div>
                  </RadioGroupPrimitive.Item>
                  <p className="text-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                    Dark
                  </p>
                </div>
              </RadioGroupPrimitive.Root>
            </motion.div>
          </div>
        </form>
      </CardContent>

      <motion.div variants={item}>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Finish</Button>
        </CardFooter>
      </motion.div>
    </>
  );
}

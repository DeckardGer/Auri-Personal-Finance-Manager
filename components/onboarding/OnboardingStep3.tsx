import { motion, Variants } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import light from '@/public/light.png';
import dark from '@/public/dark.png';
import system from '@/public/system.png';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { onboardingStep3Schema, OnboardingStep3Schema } from '@/types/onboarding-schemas';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export function OnboardingStep3({
  nextStep,
  prevStep,
  item,
}: {
  nextStep: () => void;
  prevStep: () => void;
  item: Variants;
}) {
  const { theme, setTheme } = useOnboardingStore();

  const form = useForm<OnboardingStep3Schema>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      theme: theme,
    },
  });

  const onSubmit = (values: OnboardingStep3Schema) => {
    setTheme(values);
    nextStep();
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroupPrimitive.Root
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex-1 space-y-2">
                          <FormControl>
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
                          </FormControl>
                          <FormLabel className="flex items-center justify-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                            System
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex-1 space-y-2">
                          <FormControl>
                            <RadioGroupPrimitive.Item
                              className="peer w-full flex-1 overflow-hidden rounded-lg border-2 border-input ring-offset-2 ring-offset-card transition-all outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                              value="light"
                              autoFocus
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
                          </FormControl>
                          <FormLabel className="flex items-center justify-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                            Light
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex-1 space-y-2">
                          <FormControl>
                            <RadioGroupPrimitive.Item
                              className="peer w-full flex-1 overflow-hidden rounded-lg border-2 border-input ring-offset-2 ring-offset-card transition-all outline-none data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                              value="dark"
                              autoFocus
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
                          </FormControl>
                          <FormLabel className="flex items-center justify-center text-sm text-muted-foreground peer-data-[state=checked]:text-primary">
                            Dark
                          </FormLabel>
                        </FormItem>
                      </RadioGroupPrimitive.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={item}>
              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={prevStep}>
                  Back
                </Button>
                <Button type="submit">Continue</Button>
              </div>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </>
  );
}

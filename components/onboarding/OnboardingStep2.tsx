import { motion, Variants } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import openai from '@/public/openai.svg';
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
import { Input } from '@/components/ui/input';
import { onboardingStep2Schema, type OnboardingStep2Schema } from '@/types/onboarding-schemas';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export function OnboardingStep2({
  nextStep,
  prevStep,
  item,
}: {
  nextStep: () => void;
  prevStep: () => void;
  item: Variants;
}) {
  const { apiKey, setApiKey } = useOnboardingStore();

  const form = useForm<OnboardingStep2Schema>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      apiKey,
    },
  });

  const onSubmit = (values: OnboardingStep2Schema) => {
    setApiKey(values);
    nextStep();
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
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
                      <FormControl>
                        <Input placeholder="sk-..." className="pl-10" autoFocus {...field} />
                      </FormControl>
                    </div>
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

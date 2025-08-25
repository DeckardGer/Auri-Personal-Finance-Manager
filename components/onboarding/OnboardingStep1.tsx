import { motion, Variants } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { onboardingStep1Schema, OnboardingStep1Schema } from '@/types/onboarding-schemas';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export function OnboardingStep1({
  nextStep,
  prevStep,
  item,
}: {
  nextStep: () => void;
  prevStep: () => void;
  item: Variants;
}) {
  const { name, job, setUserDetails } = useOnboardingStore();

  const form = useForm<OnboardingStep1Schema>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      name,
      job,
    },
  });

  const onSubmit = (values: OnboardingStep1Schema) => {
    setUserDetails(values);
    nextStep();
  };

  return (
    <>
      <CardHeader>
        <motion.div variants={item}>
          <CardTitle>User Details</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>This information helps us understand you better.</CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={item}>
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
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

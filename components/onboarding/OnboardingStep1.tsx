import { motion, Variants } from 'framer-motion';
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

export function OnboardingStep1({
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
          <CardTitle>User Details</CardTitle>
        </motion.div>
        <motion.div variants={item}>
          <CardDescription>This information helps us understand you better.</CardDescription>
        </motion.div>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <motion.div variants={item}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="John Doe" required autoFocus />
              </div>
            </motion.div>
            <motion.div variants={item}>
              <div className="grid gap-2">
                <Label htmlFor="job">Job Title</Label>
                <Input id="job" type="text" placeholder="Software Engineer" required />
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

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TransactionsFileUpload } from '@/components/dashboard/TransactionsFileUpload';
import { processTransactions } from '@/actions/transactions';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { defineStepper } from '@/components/ui/stepper';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import uploadTransactionsIconLight from '@/public/Upload Transactions Icon Light.svg';
import uploadTransactionsIconDark from '@/public/Upload Transactions Icon Dark.svg';
import { Check } from 'lucide-react';

const { Stepper } = defineStepper(
  { id: 'step-1', step: 1 },
  { id: 'step-2', step: 2 },
  { id: 'step-3', step: 3 },
  { id: 'step-3', step: 3 }
);

export function UploadTransactionsDialog() {
  const { resolvedTheme } = useTheme();
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const preProcessTransactions = () => {
    if (files[0].file instanceof File) processTransactions(files[0].file);
  };

  return (
    <Dialog>
      <Stepper.Provider>
        {({ methods }) => (
          <>
            <DialogTrigger asChild>
              <Button variant="outline">Upload Transactions</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <div className="absolute w-full overflow-hidden p-0.5">
                <FlickeringGrid
                  className="[border-radius:calc(var(--radius)-2px)] mask-b-from-0% mask-b-to-100%"
                  squareSize={3}
                  gridGap={6}
                  color={resolvedTheme === 'dark' ? '#9e77ed' : '#7556d9'}
                  maxOpacity={0.5}
                  flickerChance={0.12}
                  height={220}
                  width={550}
                />
              </div>
              <DialogHeader className="relative">
                <div className="mx-auto flex items-center justify-center rounded-full bg-background p-1">
                  <Image
                    src={
                      resolvedTheme === 'dark'
                        ? uploadTransactionsIconDark
                        : uploadTransactionsIconLight
                    }
                    alt="Upload Transactions Icon"
                    className="size-20"
                    unoptimized
                    priority
                  />
                </div>
                <Stepper.Navigation className="mx-auto my-2 w-full max-w-40">
                  {methods.all.slice(0, -1).map((step) => (
                    <Stepper.Step
                      key={step.id}
                      of={step.id}
                      icon={
                        step.step < methods.current.step ? <Check className="size-4" /> : undefined
                      }
                      isLast={step.step === methods.all.length - 1 || undefined}
                    />
                  ))}
                </Stepper.Navigation>
                <DialogTitle className="text-center text-xl">Upload Transactions</DialogTitle>
                <DialogDescription className="text-center text-base">
                  Your transactions will be automatically processed.
                </DialogDescription>
              </DialogHeader>
              <TransactionsFileUpload updateFiles={setFiles} />
              <DialogFooter className="flex sm:justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={preProcessTransactions} disabled={files.length === 0}>
                  Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </Stepper.Provider>
    </Dialog>
  );
}

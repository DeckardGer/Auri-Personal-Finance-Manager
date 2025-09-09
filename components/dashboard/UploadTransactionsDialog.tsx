'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
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
import { preProcessTransactions, processTransactions } from '@/actions/transactions';
import { FlickeringGrid } from '@/components/ui/flickering-grid';
import { defineStepper } from '@/components/ui/stepper';
import { ShimmeringText } from '@/components/ui/shimmering-text';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import uploadTransactionsIconLight from '@/public/Upload Transactions Icon Light.svg';
import uploadTransactionsIconDark from '@/public/Upload Transactions Icon Dark.svg';

const { useStepper } = defineStepper(
  { id: 'step-1', step: 'Upload Transactions' },
  { id: 'step-2', step: 'AI Categorise Transactions' },
  { id: 'step-3', step: 'Review Transactions' }
);

export function UploadTransactionsDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { resolvedTheme } = useTheme();
  const methods = useStepper();

  const uploadTransactions = async () => {
    if (!(files[0].file instanceof File)) {
      toast.error('Issue uploading file', {
        description: 'File is not a valid file',
      });
      return;
    }

    const transactionsResult = await preProcessTransactions(files[0].file);

    if (transactionsResult.status === 'error') {
      toast.error('Issue uploading file', {
        description: transactionsResult.message,
      });
      return;
    }

    methods.goTo('step-2');

    await processTransactions();
  };

  const onOpenChange = () => {
    if (!open) {
      setOpen(true);
      methods.reset();
    } else if (methods.current.id === 'step-2') {
      return;
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            height={190}
            width={550}
          />
        </div>
        <DialogHeader className="relative">
          <div className="mx-auto flex items-center justify-center rounded-full bg-background p-1">
            <Image
              src={
                resolvedTheme === 'dark' ? uploadTransactionsIconDark : uploadTransactionsIconLight
              }
              alt="Upload Transactions Icon"
              className="size-20"
              unoptimized
              priority
            />
          </div>
          <DialogTitle className="text-center text-xl">
            {methods.isFirst ? (
              'Upload Transactions'
            ) : (
              <ShimmeringText
                text="Processing Transactions"
                duration={1.5}
                repeatDelay={1}
                color="var(--color-foreground)"
                shimmerColor="var(--color-muted)"
              />
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {methods.isFirst
              ? 'Upload your transactions to get started.'
              : 'This might take a few minutes.'}
          </DialogDescription>
        </DialogHeader>
        {methods.isFirst ? (
          <TransactionsFileUpload updateFiles={setFiles} />
        ) : (
          <div className="flex items-center justify-center">
            <div className="onboarding-loader" />
          </div>
        )}
        {methods.isFirst && (
          <DialogFooter className="flex sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={uploadTransactions} disabled={files.length === 0}>
              Upload
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

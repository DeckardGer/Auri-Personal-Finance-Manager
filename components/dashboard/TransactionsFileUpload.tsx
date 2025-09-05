import { useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import csvFileIcon from '@/public/CSV File Icon.svg';
import { Button } from '@/components/ui/button';
import { useFileUpload, type FileWithPreview } from '@/hooks/use-file-upload';
import { CloudUpload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  className?: string;
  updateFiles?: (files: FileWithPreview[]) => void;
}

export function TransactionsFileUpload({ className, updateFiles }: FileUploadProps) {
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      removeFile,
    },
  ] = useFileUpload({
    accept: '.csv',
    multiple: false,
    onFilesAdded: updateFiles,
  });

  useEffect(() => {
    if (errors.length > 0) {
      for (const error of errors) {
        toast('Issue uploading file', {
          description: error,
        });
      }
    }
  }, [errors]);

  return (
    <div className={cn('w-full max-w-4xl', className)}>
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-4 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          {files.length > 0 ? (
            <div className="flex w-full items-center">
              <Image src={csvFileIcon} alt="CSV File Icon" width={36} height={36} priority />
              <h4 className="ml-4 text-sm">{files[0].file.name}</h4>
              <Button
                onClick={() => {
                  updateFiles?.([]);
                  removeFile(files[0].id);
                }}
                variant="ghost"
                size="icon"
                className="ml-auto"
              >
                <X className="size-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-md',
                  isDragging ? 'bg-primary/10' : 'bg-muted'
                )}
              >
                <CloudUpload
                  className={cn('size-5', isDragging ? 'text-primary' : 'text-muted-foreground')}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-muted-foreground">
                  <span
                    onClick={openFileDialog}
                    className="cursor-pointer font-semibold text-primary"
                  >
                    Click to upload
                  </span>
                  &nbsp;or drag and drop
                </h3>
                <p className="text-xs text-muted-foreground">Only CSV files are supported.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

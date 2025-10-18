'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import openai from '@/public/openai.svg';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldDescription, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group';
import { updateSettings } from '@/actions/settings';
import { settingsSchema, type SettingsSchema } from '@/types/settings';
import { UserWithSettings } from '@/types/user';
import { Eye, EyeOff } from 'lucide-react';

export function SettingsForm({ user }: { user: UserWithSettings }) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    mode: 'onTouched',
    defaultValues: {
      userId: user.id,
      name: user.name,
      job: user.job,
      country:
        user.countryName && user.countrySymbol && user.currency
          ? {
              name: user.countryName,
              alpha3: user.countrySymbol,
              currencies: [user.currency],
            }
          : undefined,
      apiKey: user.apiKey,
      pendingTransactionsBuffer: user.settings?.pendingDaysBuffer || 14,
      dateColumnOverride: user.settings?.dateColumnIndex ?? undefined,
      amountColumnOverride: user.settings?.amountColumnIndex ?? undefined,
      descriptionColumnOverride: user.settings?.descriptionColumnIndex ?? undefined,
    },
  });

  const onSubmit = async (data: SettingsSchema) => {
    try {
      await updateSettings(data);
      toast.success('Settings Updated', {
        description: 'Your settings have been updated',
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Settings Update Failed', {
        description: 'An error occurred while updating your settings',
        action: {
          label: 'Retry',
          onClick: () => onSubmit(data),
        },
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Settings</h1>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-2">
          <Button className="w-full sm:w-auto" type="submit">
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <SettingsCard title="User Details">
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <FieldDescription>The name we will use to refer to you</FieldDescription>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="job"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="job">Job Title</FieldLabel>
                  <FieldDescription>Used for possible tax purposes</FieldDescription>
                  <Input
                    {...field}
                    id="job"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Software Engineer"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </SettingsCard>

        <SettingsCard title="AI Settings">
          <FieldGroup>
            <Controller
              name="apiKey"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="apiKey">OpenAI API Key</FieldLabel>
                  <FieldDescription>
                    For categorising transactions and generating insights
                  </FieldDescription>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="apiKey"
                      type={showPassword ? 'text' : 'password'}
                      aria-invalid={fieldState.invalid}
                      placeholder="sk-..."
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <Image
                        src={openai}
                        alt="OpenAI"
                        width={16}
                        height={16}
                        className="h-4 w-4 dark:invert"
                        priority
                        unoptimized
                      />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        variant="ghost"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        size="icon-xs"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </SettingsCard>

        <SettingsCard title="Localisation">
          <FieldGroup>
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <FieldDescription>
                    Used for transactions currency and possible tax purposes
                  </FieldDescription>
                  <CountryDropdown
                    defaultValue={field.value?.alpha3}
                    placeholder="Select country"
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </SettingsCard>

        <SettingsCard title="Transactions Upload">
          <FieldGroup>
            <Controller
              name="pendingTransactionsBuffer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pendingTransactionsBuffer">
                    Pending Transactions Buffer
                  </FieldLabel>
                  <FieldDescription>Days buffered for pending transactions</FieldDescription>
                  <Input
                    {...field}
                    id="pendingTransactionsBuffer"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    placeholder="Default: 14"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </SettingsCard>
      </div>
    </form>
  );
}

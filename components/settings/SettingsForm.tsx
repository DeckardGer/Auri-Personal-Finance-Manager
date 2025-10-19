'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';
import openai from '@/public/openai.svg';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldDescription, FieldLabel, FieldError } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';
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
import { Eye, EyeOff, Info } from 'lucide-react';

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
      dateColumnOverride: user.settings?.dateColumnIndex?.toString() ?? '',
      amountColumnOverride: user.settings?.amountColumnIndex?.toString() ?? '',
      descriptionColumnOverride: user.settings?.descriptionColumnIndex?.toString() ?? '',
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
                  <FieldDescription className="truncate">
                    The name we will use to refer to you
                  </FieldDescription>
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
                  <FieldDescription className="truncate">
                    Used for possible tax purposes
                  </FieldDescription>
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
                  <FieldDescription className="truncate">
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
                  <FieldDescription className="truncate">
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
          <FieldGroup className="grid grid-cols-2 grid-rows-2 gap-4">
            <Controller
              name="pendingTransactionsBuffer"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pendingTransactionsBuffer">
                    Pending Transactions Buffer
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">What is this?</h4>
                          <p className="text-sm text-muted-foreground">
                            Banks often export all transactions associated with an account,
                            including pending transactions (transactions that have not yet been
                            confirmed by the bank).
                            <br />
                            Since these transactions can change over time, we need to buffer them
                            for a few days to ensure we have the most up to date information.
                            <br />
                            This number is just how many days worth of transactions we look over to
                            see if tranactions have changed.
                            <br />
                            <br />
                            <span className="font-semibold text-foreground">TLDR: </span>
                            Set this to 14 if you&apos;re unsure.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </FieldLabel>
                  <FieldDescription className="truncate">
                    Days buffered for pending transactions
                  </FieldDescription>
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
            <Controller
              name="dateColumnOverride"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="dateColumnOverride">
                    Date Column Override
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">What is this?</h4>
                          <p className="text-sm text-muted-foreground">
                            The system automatically looks for the column with the header
                            &quot;Date&quot;. If this is not what the column is called, you can
                            override it here.
                          </p>
                          <Separator />
                          <p className="text-sm text-muted-foreground">
                            Column numbers start at 1.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </FieldLabel>
                  <FieldDescription className="truncate">
                    CSV column number override
                  </FieldDescription>
                  <Input
                    {...field}
                    id="dateColumnOverride"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="amountColumnOverride"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="amountColumnOverride">
                    Amount Column Override
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">What is this?</h4>
                          <p className="text-sm text-muted-foreground">
                            The system automatically looks for the column with the header
                            &quot;Amount&quot;. If this is not what the column is called, you can
                            override it here.
                          </p>
                          <Separator />
                          <p className="text-sm text-muted-foreground">
                            Column numbers start at 1.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </FieldLabel>
                  <FieldDescription className="truncate">
                    CSV amount number override
                  </FieldDescription>
                  <Input
                    {...field}
                    id="amountColumnOverride"
                    type="number"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="descriptionColumnOverride"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="descriptionColumnOverride">
                    Description Column Override
                    <HoverCard openDelay={100} closeDelay={100}>
                      <HoverCardTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">What is this?</h4>
                          <p className="text-sm text-muted-foreground">
                            The system automatically looks for the column with the header
                            &quot;Description&quot;. If this is not what the column is called, you
                            can override it here.
                          </p>
                          <Separator />
                          <p className="text-sm text-muted-foreground">
                            Column numbers start at 1.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </FieldLabel>
                  <FieldDescription className="truncate">
                    CSV description number override
                  </FieldDescription>
                  <Input
                    {...field}
                    id="descriptionColumnOverride"
                    type="number"
                    aria-invalid={fieldState.invalid}
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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';
import openai from '@/public/openai.svg';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldDescription, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { updateSettings } from '@/actions/settings';
import { settingsSchema, type SettingsSchema } from '@/types/settings';
import { User } from '@prisma/client';

export function SettingsForm({ user }: { user: User }) {
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
    },
  });

  const onSubmit = async (data: SettingsSchema) => {
    try {
      await updateSettings(data);
      toast('Settings updated successfully', {
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
        } as React.CSSProperties,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast('Error updating settings', {
        position: 'bottom-right',
        classNames: {
          content: 'flex flex-col gap-2',
        },
        style: {
          '--border-radius': 'calc(var(--radius)  + 4px)',
        } as React.CSSProperties,
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
    </form>
  );
}

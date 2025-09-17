'use client';
import React, { useCallback, useState, forwardRef, useEffect, memo, useRef } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ChevronDown, CheckIcon, Globe } from 'lucide-react';
import { CircleFlag } from 'react-circle-flags';
import { countries } from 'country-data-list';

// Country interface
export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
}

// Memoized country list to prevent recalculation
const defaultCountries = countries.all.filter(
  (country: Country) => country.emoji && country.status !== 'deleted' && country.ioc !== 'PRK'
);

// Memoized country item component to prevent unnecessary re-renders
const CountryItem = memo(
  ({
    option,
    isSelected,
    onSelect,
  }: {
    option: Country;
    isSelected: boolean;
    onSelect: (country: Country) => void;
  }) => (
    <CommandItem className="flex w-full items-center gap-2" onSelect={() => onSelect(option)}>
      <div className="flex w-0 flex-grow space-x-2 overflow-hidden">
        <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <CircleFlag countryCode={option.alpha2.toLowerCase()} height={20} />
        </div>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{option.name}</span>
      </div>
      <CheckIcon
        className={cn('ml-auto h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
      />
    </CommandItem>
  )
);

CountryItem.displayName = 'CountryItem';

const CountryDropdownComponent = (
  {
    options = defaultCountries,
    onChange,
    defaultValue,
    disabled = false,
    placeholder = 'Select a country',
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(undefined);
  const onChangeRef = useRef<CountryDropdownProps['onChange']>(onChange);

  // Keep the latest onChange in a ref so we don't recreate callbacks on every prop change
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (defaultValue) {
      const initialCountry = options.find((country) => country.alpha3 === defaultValue);
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      } else {
        // Reset selected country if defaultValue is not found
        setSelectedCountry(undefined);
      }
    } else {
      // Reset selected country if defaultValue is undefined or null
      setSelectedCountry(undefined);
    }
  }, [defaultValue, options]);

  const handleSelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    onChangeRef.current?.(country);
    setOpen(false);
  }, []);

  const triggerClasses = cn(
    'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 [&>span]:line-clamp-1',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    !selectedCountry && 'text-muted-foreground',
    slim === true && 'w-20'
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
        {selectedCountry ? (
          <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
            <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <CircleFlag countryCode={selectedCountry.alpha2.toLowerCase()} height={20} />
            </div>
            {slim === false && (
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedCountry.name}
              </span>
            )}
          </div>
        ) : (
          <span>{slim === false ? placeholder : <Globe size={20} />}</span>
        )}
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="max-h-[200px] w-full sm:max-h-[270px]">
          <CommandList>
            <div className="sticky top-0 z-10 bg-popover">
              <CommandInput placeholder="Search country..." />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option) => (
                  <CountryItem
                    key={option.alpha3 || option.alpha2 || option.name}
                    option={option}
                    isSelected={option.alpha3 === selectedCountry?.alpha3}
                    onSelect={handleSelect}
                  />
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = 'CountryDropdownComponent';

export const CountryDropdown = forwardRef(CountryDropdownComponent);

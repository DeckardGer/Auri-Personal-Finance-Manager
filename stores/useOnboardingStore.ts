import { create } from 'zustand';
import { Country } from '@/components/ui/country-dropdown';
import {
  OnboardingStep1Schema,
  OnboardingStep2Schema,
  OnboardingStep3Schema,
} from '@/types/onboarding-schemas';

type OnboardingState = {
  name: string;
  job: string;
  country: Country | undefined;
  apiKey: string;
  theme: 'system' | 'light' | 'dark';

  setUserDetails: (data: OnboardingStep1Schema) => void;
  setApiKey: (data: OnboardingStep2Schema) => void;
  setTheme: (data: OnboardingStep3Schema) => void;
  getCurrentState: () => OnboardingState;
};

const initialState: Pick<OnboardingState, 'name' | 'job' | 'country' | 'apiKey' | 'theme'> = {
  name: '',
  job: '',
  country: undefined,
  apiKey: '',
  theme: 'system',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setUserDetails: (data) =>
    set((state) => ({
      ...state,
      name: data.name,
      job: data.job,
      country: data.country,
    })),

  setApiKey: (data) =>
    set((state) => ({
      ...state,
      apiKey: data.apiKey,
    })),

  setTheme: (data) =>
    set((state) => ({
      ...state,
      theme: data.theme,
    })),

  getCurrentState: () => get(),
}));

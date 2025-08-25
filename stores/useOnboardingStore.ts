import { create } from 'zustand';

import {
  OnboardingStep1Schema,
  OnboardingStep2Schema,
  OnboardingStep3Schema,
} from '@/types/onboarding-schemas';

type OnboardingState = {
  name: string;
  job: string;
  apiKey: string;
  theme: 'system' | 'light' | 'dark';

  setUserDetails: (data: OnboardingStep1Schema) => void;
  setApiKey: (data: OnboardingStep2Schema) => void;
  setTheme: (data: OnboardingStep3Schema) => void;
};

const initialState: Pick<OnboardingState, 'name' | 'job' | 'apiKey' | 'theme'> = {
  name: '',
  job: '',
  apiKey: '',
  theme: 'system',
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,

  setUserDetails: (data) =>
    set((state) => ({
      ...state,
      name: data.name,
      job: data.job,
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
}));

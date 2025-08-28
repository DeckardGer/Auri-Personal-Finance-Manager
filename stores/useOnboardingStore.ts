import { create } from 'zustand';
import { Country } from '@/components/ui/country-dropdown';
import type {
  OnboardingStep1Schema,
  OnboardingStep2Schema,
  OnboardingSchema,
} from '@/types/onboarding-schemas';

type OnboardingState = {
  name: string;
  job: string;
  country?: Partial<Country>;
  apiKey: string;

  setUserDetails: (data: OnboardingStep1Schema) => void;
  setApiKey: (data: OnboardingStep2Schema) => void;
  getCurrentState: () => OnboardingSchema;
};

const initialState: Pick<OnboardingState, 'name' | 'job' | 'country' | 'apiKey'> = {
  name: '',
  job: '',
  country: undefined,
  apiKey: '',
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

  getCurrentState: () => {
    const state = get();

    return {
      name: state.name,
      job: state.job,
      apiKey: state.apiKey,
      country: state.country as Country,
    };
  },
}));

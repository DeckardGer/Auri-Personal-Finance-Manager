export type UserWithSettings = {
  id: number;
  name: string;
  job: string;
  countryName: string | null;
  countrySymbol: string | null;
  currency: string | null;
  apiKey: string;
  settings: {
    pendingDaysBuffer: number;
    dateColumnIndex: number | null;
    amountColumnIndex: number | null;
    descriptionColumnIndex: number | null;
  } | null;
};

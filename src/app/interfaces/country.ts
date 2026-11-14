export interface Country {
  adm0_a3: string;
  name_es: string;
  admin: string;
  continent: string;
  subregion: string;
}
export interface ComparisonCountry {
  country_code: string | null;
  country_name: string;

  firstTotal: number;
  secondTotal: number;

  difference: number;
  percentage: number | null;
}
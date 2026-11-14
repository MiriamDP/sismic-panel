import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { CountryMetric } from '../../../../interfaces/earthquake';
import { ComparisonCountry } from '../../../../interfaces/country';

@Component({
  selector: 'app-comparison-top-countries',
  imports: [DecimalPipe],
  templateUrl: './comparison-top-countries.html',
  styleUrl: './comparison-top-countries.css',
})
export class ComparisonTopCountries {
  firstYear = input.required<number>();
  secondYear = input.required<number>();

  firstCountries = input.required<CountryMetric[]>();
  secondCountries = input.required<CountryMetric[]>();

  countries = computed<ComparisonCountry[]>(() => {

    const first = this.firstCountries();
    const second = this.secondCountries();

    const countriesMap = new Map<string, ComparisonCountry>();

    // Incorporar países del primer año.
    first.forEach(country => {

      const key = country.country_code ?? country.country_name;

      countriesMap.set(key, {
        country_code: country.country_code,
        country_name: country.country_name,

        firstTotal: country.total_earthquakes,
        secondTotal: 0,

        difference: 0,
        percentage: null
      });

    });

    // Incorporar o actualizar países del segundo año.
    second.forEach(country => {

      const key = country.country_code ?? country.country_name;

      const existing = countriesMap.get(key);

      if (existing) {

        existing.secondTotal = country.total_earthquakes;

      } else {

        countriesMap.set(key, {
          country_code: country.country_code,
          country_name: country.country_name,

          firstTotal: 0,
          secondTotal: country.total_earthquakes,

          difference: 0,
          percentage: null
        });

      }

    });

    // Calcular diferencias y porcentajes.
    return Array.from(countriesMap.values())
      .map(country => {

        const difference = country.secondTotal - country.firstTotal;

        const percentage = country.firstTotal === 0
          ? null
          : (difference / country.firstTotal) * 100;

        return {
          ...country,
          difference,
          percentage
        };

      })
      .sort((a, b) =>
        (b.firstTotal + b.secondTotal) -
        (a.firstTotal + a.secondTotal)
      );

  });
}

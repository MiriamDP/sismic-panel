import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Earthquake } from '../../../../interfaces/earthquake';

@Component({
  selector: 'app-comparison-max-earthquake',
  imports: [DecimalPipe,DatePipe],
  templateUrl: './comparison-max-earthquake.html',
  styleUrl: './comparison-max-earthquake.css',
})
export class ComparisonMaxEarthquake {
 firstYear = input.required<number>();
  secondYear = input.required<number>();

  firstEarthquake = input.required<Earthquake | null>();
  secondEarthquake = input.required<Earthquake | null>();

  magnitudeDifference = computed(() => {

    const first = this.firstEarthquake();
    const second = this.secondEarthquake();

    if (!first || !second) {
      return null;
    }

    return second.magnitude - first.magnitude;
  });
}

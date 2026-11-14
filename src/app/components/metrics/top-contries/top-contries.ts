import { Component, input } from '@angular/core';
import { CountryMetric } from '../../../interfaces/earthquake';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-contries',
  imports: [DecimalPipe, DatePipe,RouterLink],
  templateUrl: './top-contries.html',
  styleUrl: './top-contries.css',
})
export class TopContries {
  countries = input.required<CountryMetric[]>();
}

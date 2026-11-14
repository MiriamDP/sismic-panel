import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Earthquake } from '../../../interfaces/earthquake';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-max-earthquake',
  imports: [DatePipe,RouterLink],
  templateUrl: './max-earthquake.html',
  styleUrl: './max-earthquake.css',
})
export class MaxEarthquake {
  earthquake = input.required<Earthquake | null>();
}

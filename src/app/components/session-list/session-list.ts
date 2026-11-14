import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EarthquakeStoreService } from '../../services/earthquake-store-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-session-list',
  imports: [RouterLink,DatePipe],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css',
})
export class SessionList {
  private earthquakeStore=inject(EarthquakeStoreService);
  earthquakes = this.earthquakeStore.earthquakes;
  halfLength = computed(() => Math.ceil(this.earthquakes().length / 2));
}

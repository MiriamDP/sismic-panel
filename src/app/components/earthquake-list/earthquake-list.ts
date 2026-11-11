import { Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EarthquakeService } from '../../services/earthquake-service';
import { DatePipe, JsonPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Pagination } from '../pagination/pagination';
import { Earthquake } from '../../interfaces/earthquake';

@Component({
  selector: 'app-earthquake-list',
  imports: [DatePipe, Pagination, RouterLink, JsonPipe],
  templateUrl: './earthquake-list.html',
  styleUrl: './earthquake-list.css',
})
export class EarthquakeList {
  earthquakes = input<Earthquake[]>()
  private route = inject(ActivatedRoute);
  today = new Date();

  queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map(params => ({
        page: Number(params.get('page') ?? 1),
        pageSize: Number(params.get('pageSize') ?? 20),

        countryCode: params.get('countryCode'),
        startDate: params.get('startDate'),
        endDate: params.get('endDate'),

        minMagnitude: params.get('minMagnitude'),
        maxMagnitude: params.get('maxMagnitude'),

        minDepth: params.get('minDepth'),
        maxDepth: params.get('maxDepth')
      }))
    ),
    {
      initialValue: {
        page: 1,
        pageSize: 20,
        countryCode: null,
        startDate: null,
        endDate: null,
        minMagnitude: null,
        maxMagnitude: null,
        minDepth: null,
        maxDepth: null
      }
    }
  );

  currentPage = computed(() => this.queryParams().page);
  pageSize = computed(() => this.queryParams().pageSize);

  isToday(date: string | Date): boolean {
    const eventDate = new Date(date);
    const today = new Date();

    return eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear();
  }

  
}


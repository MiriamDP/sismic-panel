import { httpResource } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  private apiUrl = 'http://localhost:8000/api/countries';

  countries=httpResource<Country[]>(()=>{
    return this.apiUrl},{defaultValue:[]});
}

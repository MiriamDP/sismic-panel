import { httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country';
import { ConfigService } from './config-service';

@Injectable({
  providedIn: 'root',
})
export class CountryService {

  private configSvc = inject(ConfigService);
  private apiUrl = this.configSvc.settings.apiUrl+'/api/countries';

  countries=httpResource<Country[]>(()=>{
    return this.apiUrl},{defaultValue:[]});
}

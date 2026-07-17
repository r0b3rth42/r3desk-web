import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Area } from '../models/area';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

    private readonly http = inject(HttpClient);

    private readonly API =
      'https://2vclckmpu9.execute-api.us-east-1.amazonaws.com/api/mantenimiento/';
  
      list(): Observable<Area[]> {
        return this.http.get<Area[]>(this.API + 'area');
      }

      register(area: Area){ 
        return this.http.post<Area>(`${this.API}area`, area);
      }

      update(area: Area) {
        return this.http.put<Area>(`${this.API}area`, area);
      }
}
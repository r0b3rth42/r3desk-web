import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../models/grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

    private readonly http = inject(HttpClient);

    private readonly API =
      'http://localhost:8080/api/mantenimiento/';
  
      listAll(): Observable<Grupo[]> {
        return this.http.get<Grupo[]>(`${this.API}grupo`);
      }

      list(areaId: number): Observable<Grupo[]> {
        return this.http.get<Grupo[]>(this.API + `/grupo/area/${areaId}`);
      }

      update(grupo: Grupo) {
        return this.http.put<Grupo>(`${this.API}/grupo`, grupo);
      }

      
      register(grupo: Grupo) {
        return this.http.post<Grupo>(`${this.API}/grupo`, grupo);
      }



}
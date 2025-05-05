import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { Observable } from 'rxjs';
import { VehiclePosition } from '../models/vehicle-position.model';

@Injectable({ providedIn: 'root' })
export class VehiclePositionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4200/api/vehiclepositions';

  private positionsSignal = signal<VehiclePosition[]>([]);
  positions = this.positionsSignal.asReadonly();

  loadPositions(vehicleId: number) {
    this.http.get<VehiclePosition[]>(`${this.apiUrl}/vehicle/${vehicleId}`)
      .subscribe(positions => {
        this.positionsSignal.set(positions);
      });
  }

  addPosition(position: Omit<VehiclePosition, 'id' | 'timestamp'>) {
    return this.http.post<VehiclePosition>(this.apiUrl, {
      ...position,
      timestamp: new Date().toISOString()
    });
  }

  updatePosition(vehicleId: number, lat: number, lng: number, speed: number = 0, heading: number = 0): Observable<VehiclePosition> {
    return this.http.post<VehiclePosition>(`${this.apiUrl}/update`, {
      vehicleId,
      latitude: lat,
      longitude: lng,
      speed,
      heading
    });
  }
}
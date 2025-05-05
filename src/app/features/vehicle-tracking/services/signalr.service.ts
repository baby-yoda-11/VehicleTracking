import { Injectable, effect } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { VehiclePosition } from '../models/vehicle-position.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection =null!;
  private positionUpdateSource = new Subject<VehiclePosition>();
  public positionUpdate$ = this.positionUpdateSource.asObservable();

  positionUpdate = signal<VehiclePosition | null>(null);
  positionsMap = signal<Map<number, VehiclePosition>>(new Map());

  constructor() {
    this.buildConnection();
    this.startConnection();

    effect(() => {
      const update = this.positionUpdate();
      if (update) {
        console.log('New position received:', update);
      }
    });
  }

  private buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:4200/vehicleHub')
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 2000 + 2000; // 2-4 seconds for first minute
          }
          return 15000; // Then every 15 seconds
        }
      })
      .build();
  }

  private startConnection() {
    this.hubConnection.start()
      .then(() => {
        console.log('SignalR Connected');
        this.registerHandlers();
      })
      .catch(err => console.error('SignalR Connection Error:', err));
  }

  // Public API
  getVehiclePosition(vehicleId: number): VehiclePosition | undefined {
    return this.positionsMap().get(vehicleId);
  }


  private registerHandlers() {
    this.hubConnection.on('ReceivePositionUpdate', (position: VehiclePosition) => {
      this.positionUpdate.set(position);
    });
  }
  
}
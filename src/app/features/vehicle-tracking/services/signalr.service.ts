import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { VehiclePosition } from '../models/vehicle-position.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection = null!;
  private positionsMap = new Map<number, VehiclePosition[]>();
  private positionUpdateSource = new BehaviorSubject<VehiclePosition | null>(null);

  public positionUpdate$ = this.positionUpdateSource.asObservable();

  constructor(
  ) {
    this.buildConnection();
    this.startConnection();
  }

  private buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44385/geoLocationHub') // Replace with your API URL
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 2000 + 2000; // Retry every 2-4 seconds for the first minute
          }
          return 15000; // Retry every 15 seconds afterward
        }
      })
      .build();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.registerHandlers();
      })
      .catch(err => console.error('SignalR Connection Error:', err));
  }

  private registerHandlers() {
    // Listen for position updates from the SignalR hub
    this.hubConnection.on('ReceivePositionUpdate', (position: VehiclePosition) => {
      console.log('Position update received:', position);

      // Update the positions map
      if (!this.positionsMap.has(position.vehicleId)) {
        this.positionsMap.set(position.vehicleId, []);
      }
      const vehiclePositions = this.positionsMap.get(position.vehicleId)!;
      vehiclePositions.push(position);

      // Emit the latest position
      this.positionUpdateSource.next(position);
    });
  }
}
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { SignalRService } from '../services/signalr.service';
import { IVehicle } from '../models/vehicle';
import { VehiclePosition } from '../models/vehicle-position.model';

@Component({
  selector: 'app-vehicle-map',
  standalone: false,
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.scss']
})
export class VehicleMapComponent {
  center: google.maps.LatLngLiteral = { lat: 17.4062, lng: 78.4691 };
  zoom = 17;
  path: google.maps.LatLngLiteral[] = []; // Path for the vehicle
  vehicles : IVehicle[] = [];
  selectedVehicleId !: number;
  attachedDeviceIds : string[] = [];
  vehicleDetails : string = '';
  lastVehiclePostion !: VehiclePosition;

  constructor(
    private vehicleTrackingService: VehicleTrackingService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.vehicleTrackingService.getAllVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      }
    })
  }
  
  selectVehicle(id: number)
  {
    this.selectedVehicleId = id;
    this.fetchVehicleDetails(id);
    this.fetchInitialPosition();
    this.subscribeToPositionUpdates();
  }
  
  private fetchVehicleDetails(vehicleId: number): void {
    
    this.vehicleTrackingService.getVehicleDevices(vehicleId).subscribe({
      next: (devices) => {
        this.attachedDeviceIds = devices.map(device => device.deviceId);
      }});
    
    this.vehicleTrackingService.getVehicleById(vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicleDetails = this.formatVehicleDetails(vehicle, this.attachedDeviceIds);
      }
    });
  }

  formatVehicleDetails(vehicle: IVehicle , devices : string[]): string {    
    return `RegistrationNumber: ${vehicle.registrationNumber},\nVehicle Model: ${vehicle.model},\nDevices: ${devices.join(', ')}`;
  }

  private fetchInitialPosition(): void {
    this.vehicleTrackingService.getLastVehiclePosition(this.selectedVehicleId).subscribe({
      next: (vehiclePosition) => {
        this.lastVehiclePostion = vehiclePosition;
        this.center = { lat: vehiclePosition.latitude, lng: vehiclePosition.longitude };
        this.path = [this.center];
      }
    });
  }

  private subscribeToPositionUpdates(): void {
    this.signalRService.positionUpdate$.subscribe(update => {
      if (update && update.vehicleId === this.selectedVehicleId) {
        this.center = { lat: update.latitude, lng: update.longitude };
        if(!this.isValidBreak(this.lastVehiclePostion.timestamp, update.timestamp))
          {
            this.path = [];
          }
        this.lastVehiclePostion = update;
        this.path = [...this.path, { lat: update.latitude, lng: update.longitude }];
      }
    });
  }

  isValidBreak(date1: any, date2: any): boolean {
  
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diffInMs = Math.abs(d1.getTime() - d2.getTime());
    if (Math.floor(diffInMs / 60000) < 5) {
      return true;
    }
    return false;
  }

  getVehicleIcon(): google.maps.Icon {
    return {
      url: 'assets/car-icon.png',
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  }
}

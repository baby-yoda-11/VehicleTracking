import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { SignalRService } from '../services/signalr.service';
import { IVehicle } from '../models/vehicle';

@Component({
  selector: 'app-vehicle-map',
  standalone: false,
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.scss']
})
export class VehicleMapComponent {
  center: google.maps.LatLngLiteral = { lat: 17.4062, lng: 78.4691 };
  zoom = 16;
  path: google.maps.LatLngLiteral[] = []; // Path for the vehicle
  vehicles : IVehicle[] = [];
  selectedVehicleId !: number;
  attachedDeviceIds : string[] = [];
  vehicleDetails : string = '';
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
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['selectedVehicleId'] && changes['selectedVehicleId'].currentValue) {
  //     this.fetchInitialPosition();
  //     this.subscribeToPositionUpdates();
  //   }
  // }

  private fetchInitialPosition(): void {
    this.vehicleTrackingService.getLastVehiclePosition(this.selectedVehicleId).subscribe({
      next: (vehicle) => {
        this.center = { lat: vehicle.latitude, lng: vehicle.longitude };
        this.path = [this.center];
      }
    });
  }

  private subscribeToPositionUpdates(): void {
    this.signalRService.positionUpdate$.subscribe(update => {
      if (update && update.vehicleId === this.selectedVehicleId) {
        // Add the new position to the path
        this.path = [...this.path, { lat: update.latitude, lng: update.longitude }];

        // Update the map center to the latest position
        this.center = { lat: update.latitude, lng: update.longitude };
      }
    });
  }

  getVehicleIcon(): google.maps.Icon {
    return {
      url: 'assets/car-icon.png',
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    };
  }
}

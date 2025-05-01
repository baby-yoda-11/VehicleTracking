import { Component, OnInit } from '@angular/core';
import { VehicleTrackingService } from '../features/vehicle-tracking/shared/state/vehicle-tracking.service';
import { pairingModel } from '../features/vehicle-tracking/models/pairingModel';
import { IVehicle } from '../features/vehicle-tracking/models/vehicle';
import { IDevice } from '../features/vehicle-tracking/models/device';

@Component({
  selector: 'app-vehicle-admin',
  standalone: false,
  templateUrl: './vehicle-admin.component.html',
  styleUrls: ['./vehicle-admin.component.scss']
})
export class VehicleAdminComponent implements OnInit {
  vehicles: IVehicle[] = [];
  availableDevices: IDevice[] = [];
  pairedDevices: IDevice[] = [];
  selectedVehicleId: number | null = null;

  constructor(private vehicleTrackingService: VehicleTrackingService) {}

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    this.vehicleTrackingService.getAllVehicles().subscribe(
      (data) => {
        this.vehicles = data;
      }
    );
  }

  fetchAvailableDevices(vehicleId: number): void {
    this.selectedVehicleId = vehicleId;
    this.vehicleTrackingService.getUnpairedDevices().subscribe(
      (data) => {
        this.availableDevices = data; // Assuming this endpoint returns available devices
      }
    );
  }

  fetchPairedDevices(vehicleId: number): void {
    this.selectedVehicleId = vehicleId;
    this.vehicleTrackingService.getVehicleDevices().subscribe(
      (data) => {
        this.pairedDevices = data; // Assuming this endpoint returns paired devices
      }
    );
  }

  assignDevice(deviceId: number): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    this.vehicleTrackingService.assignDevice(pairing as any).subscribe(
      () => {
        console.log(`Device ${deviceId} assigned to vehicle ${this.selectedVehicleId} successfully.`);
        this.availableDevices = [];
        this.selectedVehicleId = null;
      }
    );
  }

  deassignDevice(deviceId: number): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    this.vehicleTrackingService.deassignDevice(pairing as any).subscribe(
      () => {
        console.log(`Device ${deviceId} unpaired from vehicle ${this.selectedVehicleId} successfully.`);
        this.pairedDevices = [];
        this.selectedVehicleId = null;
      }
    );
  }
}

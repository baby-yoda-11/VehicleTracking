import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pairingModel } from '../features/vehicle-tracking/models/pairingModel';

@Component({
  selector: 'app-vehicle-admin',
  templateUrl: './vehicle-admin.component.html',
  styleUrls: ['./vehicle-admin.component.scss']
})
export class VehicleAdminComponent implements OnInit {
  vehicles: any[] = []; // List of vehicles
  availableDevices: any[] = []; // List of available devices for pairing
  pairedDevices: any[] = []; // List of paired devices for unpairing
  selectedVehicleId: number | null = null; // Vehicle selected for pairing/unpairing

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchVehicles();
  }

  fetchVehicles(): void {
    // Replace with your API endpoint to fetch vehicles
    this.http.get<any[]>('/api/vehicles').subscribe(
      (data) => {
        this.vehicles = data;
      }
    );
  }

  fetchAvailableDevices(vehicleId: number): void {
    this.selectedVehicleId = vehicleId;
    // Replace with your API endpoint to fetch available devices
    this.http.get<any[]>('/api/devices/available').subscribe(
      (data) => {
        this.availableDevices = data;
      },
      (error) => {
        console.error('Error fetching available devices:', error);
      }
    );
  }

  fetchPairedDevices(vehicleId: number): void {
    this.selectedVehicleId = vehicleId;
    // Replace with your API endpoint to fetch paired devices
    this.http.get<any[]>(`/api/vehicles/${vehicleId}/paired-devices`).subscribe(
      (data) => {
        this.pairedDevices = data;
      },
      (error) => {
        console.error('Error fetching paired devices:', error);
      }
    );
  }

  assignDevice(deviceId: number): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    // Replace with your API endpoint for assigning a device
    this.http.post('/api/vehicles/pair', pairing).subscribe(
      () => {
        console.log(`Device ${deviceId} assigned to vehicle ${this.selectedVehicleId} successfully.`);
        this.availableDevices = [];
        this.selectedVehicleId = null;
      },
      (error) => {
        console.error(`Error assigning device ${deviceId}:`, error);
      }
    );
  }

  deassignDevice(deviceId: number): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    // Replace with your API endpoint for deassigning a device
    this.http.post('/api/vehicles/unpair', pairing).subscribe(
      () => {
        console.log(`Device ${deviceId} unpaired from vehicle ${this.selectedVehicleId} successfully.`);
        this.pairedDevices = [];
        this.selectedVehicleId = null;
      },
      (error) => {
        console.error(`Error unpairing device ${deviceId}:`, error);
      }
    );
  }
}

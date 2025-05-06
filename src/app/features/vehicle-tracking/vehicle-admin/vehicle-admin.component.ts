import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { pairingModel } from '../models/pairingModel';
import { IVehicle } from '../models/vehicle';
import { IDevice } from '../models/device';
import { ToastrService } from 'ngx-toastr';

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
  trackingVehicleId: number | null = null;

  constructor(
    private vehicleTrackingService: VehicleTrackingService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      this.availableDevices.length > 0 &&
      !this.elementRef.nativeElement.querySelector('.modal').contains(target)
    ) {
      this.availableDevices = [];
    }

    if (
      this.pairedDevices.length > 0 &&
      !this.elementRef.nativeElement.querySelector('.modal').contains(target)
    ) {
      this.pairedDevices = [];
    }
  }

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
        if(data.length === 0) {
          this.toastr.info('No unpaired devices available.', 'Info');
          return;
        }
        this.availableDevices = data;
      }
    );
  }

  fetchPairedDevices(vehicleId: number): void {
    this.selectedVehicleId = vehicleId;
    this.vehicleTrackingService.getVehicleDevices(vehicleId).subscribe(
      (data) => {
        if(data.length === 0) {
          this.toastr.info('No paired devices available.', 'Info');
          return;
        }
        this.pairedDevices = data; // Assuming this endpoint returns paired devices
      }
    );
  }

  assignDevice(deviceId: string): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    this.vehicleTrackingService.assignDevice(pairing as any).subscribe(
      () => {
        this.toastr.success(`Device ${deviceId} assigned to vehicle ${this.selectedVehicleId} successfully.`, 'Success');
        this.availableDevices = [];
        this.selectedVehicleId = null;
      }
    );
  }

  deassignDevice(deviceId: string): void {
    if (this.selectedVehicleId === null) return;

    const pairing: pairingModel = {
      vehicleId: this.selectedVehicleId,
      deviceId: deviceId
    };

    this.vehicleTrackingService.deassignDevice(pairing as any).subscribe(
      () => {
        this.toastr.success(`Device ${deviceId} unpaired from vehicle ${this.selectedVehicleId} successfully.`, 'Success');
        this.pairedDevices = [];
        this.selectedVehicleId = null;
      }
    );
  }

  onVehicleSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const vehicleId = selectElement?.value || '';
    this.trackingVehicleId = parseInt(vehicleId, 10);
  }
}

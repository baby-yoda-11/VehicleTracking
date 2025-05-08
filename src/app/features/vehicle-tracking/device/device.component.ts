import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { tap } from 'rxjs';
import { IReference } from '../models/reference';
import { IDevice } from '../models/device';
import { jsonValidator } from '../shared/validators/jsonValidator';
import { noWhitespaceValidator } from '../shared/validators/noWhitespaceValidator';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
  standalone: false
})
export class DeviceComponent {
  deviceForm!: UntypedFormGroup;
  deviceTypes: IReference[] = [];
  devices: IDevice[] = [];
  isAddDeviceFormVisible = false;
  selectedDeviceId?: number;

  constructor(
    private fb: UntypedFormBuilder,
    private vehicleTrackingService: VehicleTrackingService
  ) {}

  getDeviceType(type: number) {
    return this.deviceTypes.find((x) => x.id === type)?.value;
  }
  ngOnInit() {
    this.vehicleTrackingService.getDeviceReferences().subscribe({
      next: (x) => {
        if (x) {
          this.deviceTypes = x;
        }
      }
    });

    this.loadDevices();

    this.createFormGroup();
  }

  loadDevices() {
    this.vehicleTrackingService.getAllDevices().subscribe({
      next: (x) => {
        if (x) {
          this.devices = x;
        }
      }
    });
  }
  
  createFormGroup(): void {
    this.deviceForm = this.fb.group({
      deviceId: ['', [Validators.required, noWhitespaceValidator(),Validators.maxLength(50)]],
      properties: ['', [Validators.required, jsonValidator, Validators.maxLength(150)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      deviceType: [null, [Validators.required]]
    });
  }

  showAddDeviceForm(): void {
    this.deviceForm.reset();
    this.deviceForm.controls['deviceId'].enable();
    this.isAddDeviceFormVisible = true;
  }

  hideAddDeviceForm(): void {
    this.isAddDeviceFormVisible = false;
    this.deviceForm.reset();
  }

  editDevice(id : number): void {
    this.selectedDeviceId = id;
    this.deviceForm.controls['deviceId'].disable();
    this.isAddDeviceFormVisible = true;
    this.vehicleTrackingService.getDeviceById(this.selectedDeviceId).subscribe({
      next: (x) => {
            this.deviceForm.patchValue(x);
        }
    });
  }

  deleteDevice(id: number): void {
    const index = this.devices.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.vehicleTrackingService.deleteDevice(this.devices[index].id).subscribe({
        next: () => {
          this.devices.splice(index, 1);
        }
      });
    }
  }
  
  onSubmit(): void {
    if (this.deviceForm.valid) {
      const deviceData: IDevice = this.deviceForm.value;
      // deviceData.properties = JSON.parse(deviceData.properties); // Parse the JSON before submitting
      deviceData.id = this.selectedDeviceId || 0;

      if (!deviceData.id) {
        // Add new device
        this.vehicleTrackingService.addDevice(deviceData).subscribe({
          next: () => {
            this.loadDevices();
            this.hideAddDeviceForm();
          },
          error: (err) => {
            console.error('Error adding device:', err);
          }
        });
      } else {
        // Update existing device
        this.vehicleTrackingService.updateDevice(deviceData).subscribe({
          next: () => {
            const index = this.devices.findIndex((d) => d.id === deviceData.id);
            if (index !== -1) {
              this.devices[index] = deviceData;
            }
            this.hideAddDeviceForm();
          },
          error: (err: any) => {
            console.error('Error updating device:', err);
          }
        });
      }
    }
  }
}

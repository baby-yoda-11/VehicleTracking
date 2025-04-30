import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { tap } from 'rxjs';
import { IReference } from '../models/reference';
import { IDevice } from '../models/device';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
  standalone: false
})
export class DeviceComponent {
  
  deviceForm!: UntypedFormGroup;
  deviceTypes: IReference[] = [];
  devices: IDevice[] = [];
  isAddDeviceFormVisible = false;
  isUpdate = false;
  
  constructor(
    private fb: UntypedFormBuilder,
    private vehicleTrackingService: VehicleTrackingService
  ) {}
    
  ngOnInit() {
    this.vehicleTrackingService.getDeviceReferences().pipe(tap(x => {
      if (x) {
        this.deviceTypes = x;
      }
    }));

    this.vehicleTrackingService.getAllDevices().pipe(tap(x => {
      if (x) {
        this.devices = x;
      }
    }));

    this.createFormGroup();
  }
    
  createFormGroup(): void {
    this.deviceForm = this.fb.group({
      deviceId: [null, [Validators.required]],
      properties: ['', [Validators.required, Validators.maxLength(100)]],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      deviceType: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      isDeleted: [false]
    });
  }
    
  showAddDeviceForm(): void {
    this.isUpdate = false;
    this.isAddDeviceFormVisible = true;
  }
    
  hideAddDeviceForm(): void {
    this.isAddDeviceFormVisible = false;
    this.deviceForm.reset();
  }
    
  editDevice(device: IDevice): void {
    this.isUpdate = true;
    this.isAddDeviceFormVisible = true;
    this.deviceForm.patchValue(device);
  }
    
  deleteDevice(id: number): void {
    const index = this.devices.findIndex(d => d.deviceId === id);
    if (index !== -1) {
      this.devices[index].isDeleted = true;
      this.vehicleTrackingService.updateDevice(this.devices[index]).subscribe({
        next: () => {
          this.devices.splice(index, 1);
        },
        error: (err) => {
          console.error('Error deleting device:', err);
        }
      });
    }
  }
    
  onSubmit(): void {
    if (this.deviceForm.valid) {
      const deviceData: IDevice = this.deviceForm.value;

      if (!deviceData.deviceId) {
        // Add new device
        this.vehicleTrackingService.addDevice(deviceData).subscribe({
          next: (device) => {
            this.devices.push(device);
            this.hideAddDeviceForm();
          },
          error: (err) => {
            console.error('Error adding device:', err);
          }
        });
      } else {
        // Update existing device
        this.vehicleTrackingService.updateDevice(deviceData).subscribe({
          next: (device: IDevice) => {
            const index = this.devices.findIndex(d => d.deviceId === device.deviceId);
            if (index !== -1) {
              this.devices[index] = device;
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

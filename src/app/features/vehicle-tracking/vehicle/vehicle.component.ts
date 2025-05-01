import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
import { tap } from 'rxjs';
import { IReference } from '../models/reference';
import { IVehicle } from '../models/vehicle';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  standalone: false
})
export class VehicleComponent {
  
  vehicleForm!: UntypedFormGroup;
  vehicleTypes: IReference[] = [];
  vehicles: IVehicle[] = [];
  isAddVehicleFormVisible = false;
  isUpdate = false;
  
  constructor(
    private fb: UntypedFormBuilder,
    private vehicleTrackingService : VehicleTrackingService) {}
    
    ngOnInit(){
      this.vehicleTrackingService.getVehicleReferences().subscribe({
          next: (x) => {
            if(x){
              this.vehicleTypes = x;
            }
          }});

      this.vehicleTrackingService.getAllVehicles().subscribe({
          next: (x) => {
            if(x){
              this.vehicles = x;
            }
          }});
          
      this.createFormGroup();
    }
    
    createFormGroup(): void {
      this.vehicleForm = this.fb.group({
        vehicleId: [null, [Validators.required]],
        registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
        model: ['', [Validators.required, Validators.maxLength(100)]],
        vehicleType: [null, [Validators.required]],
        isActive: [true, [Validators.required]],
        isDeleted: [false]
      });
    }
    
    showAddVehicleForm(): void {
      this.isUpdate = false;
      this.isAddVehicleFormVisible = true;
    }
    
    hideAddVehicleForm(): void {
      this.isAddVehicleFormVisible = false;
      this.vehicleForm.reset();
    }
    
    editVehicle(vehicle: IVehicle): void {
      this.isUpdate = true;
      this.isAddVehicleFormVisible = true;
      this.vehicleForm.patchValue(vehicle);
    }
    
    deleteVehicle(id: number) {
      const index = this.vehicles.findIndex(v => v.vehicleId === id);
      if (index !== -1) {
        this.vehicles[index].isDeleted = true;
        this.vehicleTrackingService.updateVehicle(this.vehicles[index]).subscribe({
          next: () => {
            this.vehicles.splice(index, 1);
          },
          error: (err) => {
            console.error('Error deleting vehicle:', err);
          }
        });
      }
    }
    
    onSubmit(): void {
      if (this.vehicleForm.valid) {
        const vehicleData: IVehicle = this.vehicleForm.value;
        
        if (!this.isUpdate) {
        this.vehicleTrackingService.addVehicle(vehicleData).subscribe({
          next: () => {
            this.vehicles.push(vehicleData);
            this.hideAddVehicleForm();
          },
          error: (err) => {
            console.error('Error adding vehicle:', err);
          }
        });
      } else {
        this.vehicleTrackingService.updateVehicle(vehicleData).subscribe({
          next: () => {
            const index = this.vehicles.findIndex(v => v.vehicleId === vehicleData.vehicleId);
            if (index !== -1) {
              this.vehicles[index] = vehicleData;
            }
            this.hideAddVehicleForm();
          },
          error: (err: any) => {
            console.error('Error updating vehicle:', err);
          }
        });
      }
    }
    console.log(this.vehicles);
  }
}

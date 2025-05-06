import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { VehicleTrackingService } from '../shared/state/vehicle-tracking.service';
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
  selectedVehicleId?: number;

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

      this.loadVehicles();
          
      this.createFormGroup();
    }
    
    loadVehicles(){
      this.vehicleTrackingService.getAllVehicles().subscribe({
        next: (x) => {
          if(x){
            this.vehicles = x;
          }
        }});
    }

    createFormGroup(): void {
      this.vehicleForm = this.fb.group({
        registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
        model: ['', [Validators.required, Validators.maxLength(100)]],
        vehicleType: [null, [Validators.required]],
      });
    }
    
    showAddVehicleForm(): void {
      this.isAddVehicleFormVisible = true;
    }
    
    hideAddVehicleForm(): void {
      this.isAddVehicleFormVisible = false;
      this.vehicleForm.reset();
    }
    
    editVehicle(vehicle: IVehicle): void {
      this.selectedVehicleId = vehicle.vehicleId;
      this.isAddVehicleFormVisible = true;
      this.vehicleTrackingService.getVehicleById(this.selectedVehicleId).subscribe({
        next: (x) => {
              this.vehicleForm.patchValue(x);
          }
      });
    }
    
    deleteVehicle(id: number) {
      const index = this.vehicles.findIndex(v => v.vehicleId === id);
      if (index !== -1) {
        this.vehicleTrackingService.deleteVehicle(id).subscribe({
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
        vehicleData.vehicleId = this.selectedVehicleId || 0; // Set vehicleId to 0 for new vehicles
        if (!vehicleData.vehicleId) {
        this.vehicleTrackingService.addVehicle(vehicleData).subscribe({
          next: () => {
            this.loadVehicles();
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
  }
}

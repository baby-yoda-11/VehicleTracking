import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehicleTrackingComponentsRoutingModule } from './vehicleTracking-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceComponent } from './device/device.component';
import { VehicleAdminComponent } from '../../vehicle-admin/vehicle-admin.component';

@NgModule({
    declarations: [
        VehicleComponent,
        DeviceComponent,
        VehicleAdminComponent
    ],
    imports: [
        CommonModule,
        VehicleTrackingComponentsRoutingModule,
        ReactiveFormsModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
    ]})
export class VehicleTrackingModule {}
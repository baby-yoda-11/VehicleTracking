import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehicleTrackingComponentsRoutingModule } from './vehicleTracking-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DeviceComponent } from './device/device.component';
import { VehicleAdminComponent } from './vehicle-admin/vehicle-admin.component';
import { VehicleMapComponent } from './vehicle-map/vehicle-map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [
        VehicleComponent,
        DeviceComponent,
        VehicleAdminComponent,
        VehicleMapComponent,
    ],
    imports: [
        CommonModule,
        VehicleTrackingComponentsRoutingModule,
        ReactiveFormsModule,
        GoogleMapsModule,
        MatSidenavModule,
        MatCardModule,
        MatDividerModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
    ]})
export class VehicleTrackingModule {}
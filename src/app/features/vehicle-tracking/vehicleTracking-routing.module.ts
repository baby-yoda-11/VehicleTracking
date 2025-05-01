import {RouterModule, Routes } from "@angular/router";
import { VehicleComponent } from "./vehicle/vehicle.component";
import { NgModule } from "@angular/core";
import { DeviceComponent } from "./device/device.component";
import { VehicleAdminComponent } from "../../vehicle-admin/vehicle-admin.component";

const routes: Routes = [
    {
        path: '',
        component: VehicleAdminComponent,
    },
    {
        path:'vehicles',
        component:VehicleComponent
    },
    {
        path:'devices',
        component:DeviceComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class VehicleTrackingComponentsRoutingModule {}
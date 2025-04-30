import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        children:[
            {
                path:'',
                loadChildren:()=>import('./features/vehicle-tracking/vehicleTracking.module').then(m => m.VehicleTrackingModule)
            }
        ]
    }
];
@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
  })
export class AppRoutingModule {}
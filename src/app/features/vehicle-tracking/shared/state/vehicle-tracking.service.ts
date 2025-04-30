import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { IReference } from "../../models/reference";
import { HttpClient } from "@angular/common/http";
import { VehicleTrackingRepository } from "./vehicle-tracking.repository";
import { Configuration } from "../../vehicleTracking.configuration";
import { IVehicle } from "../../models/vehicle";
import { IDevice } from "../../models/device";

@Injectable({ providedIn: 'root' })
export class VehicleTrackingService {
    
    constructor(private http: HttpClient, private repo: VehicleTrackingRepository) {}

    // Vehicle-related functions
    getVehicleReferences(): Observable<IReference[]> {
        return this.http.get<IReference[]>(`https://localhost:44310/${Configuration.endPoints.vehicle.getvehicleReferences}`)
                        .pipe(tap((res: IReference[]) => {
                            return res;
                        }));
    }

    getAllVehicles(): Observable<IVehicle[]> {
        return this.http.get<IVehicle[]>(`https://localhost:44310/${Configuration.endPoints.vehicle.getAllVehicles}`)
                        .pipe(tap((res: IVehicle[]) => {
                            return res;
                        }));
    }

    setVehicleReferences(referencesData: IReference[]): void {
        this.repo.updateProp('vehicleReferences', referencesData);
    }

    addVehicle(vehicle: IVehicle): Observable<IVehicle> {
        return this.http.post<IVehicle>(`https://localhost:44310/${Configuration.endPoints.vehicle.addVehicle}`, vehicle)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }

    updateVehicle(vehicle: IVehicle): Observable<IVehicle> {
        return this.http.put<IVehicle>(`https://localhost:44310/${Configuration.endPoints.vehicle.updateVehicle}/${vehicle.vehicleId}`, vehicle)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }

    // Device-related functions
    getDeviceReferences(): Observable<IReference[]> {
        return this.http.get<IReference[]>(`https://localhost:44310/${Configuration.endPoints.device.getDeviceReferences}`)
                        .pipe(tap((res: IReference[]) => {
                            return res;
                        }));
    }

    getAllDevices(): Observable<IDevice[]> {
        return this.http.get<IDevice[]>(`https://localhost:44310/${Configuration.endPoints.device.getAllDevices}`)
                        .pipe(tap((res: IDevice[]) => {
                            return res;
                        }));
    }

    addDevice(device: IDevice): Observable<IDevice> {
        return this.http.post<IDevice>(`https://localhost:44310/${Configuration.endPoints.device.addDevice}`, device)
                        .pipe(tap((res: IDevice) => {
                            return res;
                        }));
    }

    updateDevice(device: IDevice): Observable<IDevice> {
        return this.http.put<IDevice>(`https://localhost:44310/${Configuration.endPoints.device.updateDevice}/${device.deviceId}`, device)
                        .pipe(tap((res: IDevice) => {
                            return res;
                        }));
    }
}
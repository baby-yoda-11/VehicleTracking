import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { IReference } from "../../models/reference";
import { HttpClient } from "@angular/common/http";
import { VehicleTrackingRepository } from "./vehicle-tracking.repository";
import { Configuration } from "../../vehicleTracking.configuration";
import { IVehicle } from "../../models/vehicle";
import { IDevice } from "../../models/device";
import { pairingModel } from "../../models/pairingModel";
import { VehiclePosition } from "../../models/vehicle-position.model";

@Injectable({ providedIn: 'root' })
export class VehicleTrackingService {
    
    constructor(private http: HttpClient, private repo: VehicleTrackingRepository) {}

    // Vehicle-related functions
    getVehicleReferences(): Observable<IReference[]> {
        return this.http.get<IReference[]>(`https://localhost:44385/${Configuration.endPoints.vehicle.getVehicleReferences}`)
                        .pipe(tap((res: IReference[]) => {
                            return res;
                        }));
    }

    getAllVehicles(): Observable<IVehicle[]> {
        return this.http.get<IVehicle[]>(`https://localhost:44385/${Configuration.endPoints.vehicle.getAllVehicles}`)
                        .pipe(tap((res: IVehicle[]) => {
                            return res;
                        }));
    }

    getVehicleById(id : number): Observable<IVehicle> {
        return this.http.get<IVehicle>(`https://localhost:44385/${Configuration.endPoints.vehicle.getVehicleById(id)}`)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }

    setVehicleReferences(referencesData: IReference[]): void {
        this.repo.updateProp('vehicleReferences', referencesData);
    }

    addVehicle(vehicle: IVehicle): Observable<IVehicle> {
        return this.http.post<IVehicle>(`https://localhost:44385/${Configuration.endPoints.vehicle.addVehicle}`, vehicle)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }

    updateVehicle(vehicle: IVehicle): Observable<IVehicle> {
        return this.http.put<IVehicle>(`https://localhost:44385/${Configuration.endPoints.vehicle.updateVehicle}`, vehicle)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }

    deleteVehicle(vehicleId : number): Observable<IVehicle> {
        return this.http.delete<IVehicle>(`https://localhost:44385/${Configuration.endPoints.vehicle.deleteVehicle(vehicleId)}`);
    }

    // Device-related functions
    getDeviceReferences(): Observable<IReference[]> {
        return this.http.get<IReference[]>(`https://localhost:44385/${Configuration.endPoints.device.getDeviceReferences}`)
                        .pipe(tap((res: IReference[]) => {
                            return res;
                        }));
    }

    getAllDevices(): Observable<any> {
        return this.http.get<any>(`https://localhost:44385/${Configuration.endPoints.device.getAllDevices}`)
                        .pipe(tap((res: any) => {
                            return res;
                        }));
    }

    getDeviceById(id : number): Observable<IVehicle> {
        return this.http.get<IVehicle>(`https://localhost:44385/${Configuration.endPoints.device.getDeviceById(id)}`)
                        .pipe(tap((res: IVehicle) => {
                            return res;
                        }));
    }
    
    addDevice(device: IDevice): Observable<IDevice> {
        return this.http.post<IDevice>(`https://localhost:44385/${Configuration.endPoints.device.addDevice}`, device)
        .pipe(tap((res: IDevice) => {
            return res;
        }));
    }
    
    updateDevice(device: IDevice): Observable<IDevice> {
        return this.http.put<IDevice>(`https://localhost:44385/${Configuration.endPoints.device.updateDevice}`, device)
        .pipe(tap((res: IDevice) => {
            return res;
        }));
    }
    
    deleteDevice(id : number): any {
        return this.http.delete<IDevice>(`https://localhost:44385/${Configuration.endPoints.device.deleteDevice(id)}`)
        .pipe(tap((res: IDevice) => {
            return res;
        }));
    }

    getUnpairedDevices(): Observable<IDevice[]> {
        return this.http.get<IDevice[]>(`https://localhost:44385/${Configuration.endPoints.vehicleDevice.getUnpairedDevices}`)
                        .pipe(tap((res: IDevice[]) => {
                            return res;
                        }));
    }

    getVehicleDevices(id : number): Observable<IDevice[]> {
        return this.http.get<IDevice[]>(`https://localhost:44385/${Configuration.endPoints.vehicleDevice.getVehicleDevices(id)}`)
                        .pipe(tap((res: IDevice[]) => {
                            return res;
                        }));
    }

    assignDevice(vehicleDevice: pairingModel){
        return this.http.post(`https://localhost:44385/${Configuration.endPoints.vehicleDevice.assignDevice}`, vehicleDevice);
    }

    deassignDevice(vehicleDevice: pairingModel){
        return this.http.post(`https://localhost:44385/${Configuration.endPoints.vehicleDevice.deassignDevice}`, vehicleDevice);
    }

    getRecentVehiclePositions(id: number): Observable<VehiclePosition[]> {
        return this.http
            .get<VehiclePosition[]>(`https://localhost:44385/${Configuration.endPoints.geolocation.getRecentVehiclePositions(id)}`)
            .pipe(
                tap((res: VehiclePosition[]) => {
                    return res;
                })
            );
    }

    getLastVehiclePosition(id: number): Observable<VehiclePosition> {
        return this.http
            .get<VehiclePosition>(`https://localhost:44385/${Configuration.endPoints.geolocation.getVehiclePosition(id)}`)
            .pipe(
                tap((res: VehiclePosition) => {
                    return res;
                })
            );
    }
}
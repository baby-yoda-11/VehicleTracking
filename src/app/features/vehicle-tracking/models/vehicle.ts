export interface IVehicle {
    vehicleId : number;
    registrationNumber : string;
    model : string;
    vehicleType : number;
    isActive : boolean;
    isDeleted ?: boolean;
  }
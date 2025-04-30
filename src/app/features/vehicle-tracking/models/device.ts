export interface IDevice {
    deviceId : number;
    properties : string;
    name : string;
    deviceType : number;
    isActive : boolean;
    isDeleted ?: boolean;
  }
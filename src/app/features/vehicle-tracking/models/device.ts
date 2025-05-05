export interface IDevice {
    deviceUId : number;
    properties : string;
    name : string;
    deviceType : number;
    isActive : boolean;
    isDeleted ?: boolean;
  }
export const Api = 'api/v1';
export const Controllers = {
    vehicle: '/vehicle',
    device: '/device',
    vehicleDevice: '/vehicleDevice',
  };
export const Configuration = {
    endPoints:{
        vehicle: {
            getAllVehicles: `${Api}${Controllers.vehicle}`,
            getVehicleById : (id : number) => `${Api}${Controllers.vehicle}/${id}`, 
            addVehicle: `${Api}${Controllers.vehicle}`,
            updateVehicle : (id : number) => `${Api}${Controllers.vehicle}/${id}`,
            deleteVehicle : (id : number) => `${Api}${Controllers.vehicle}/${id}`,
            getVehicleReferences: `${Api}${Controllers.vehicle}/references`,
        },
        device: {
            getAllDevices: `${Api}${Controllers.device}`,
            getDeviceById : (id : number) => `${Api}${Controllers.device}/${id}`, 
            addDevice: `${Api}${Controllers.device}`,
            updateDevice : (id : number) => `${Api}${Controllers.device}/${id}`,
            deleteDevice : (id : number) => `${Api}${Controllers.device}/${id}`,
            getDeviceReferences: `${Api}${Controllers.device}/references`,
        },
        vehicleDevice: {
            getUnpairedDevices: `${Api}${Controllers.vehicleDevice}/getUnpairedDevices`,
            getVehicleDevices : (id : number) => `${Api}${Controllers.vehicleDevice}/${id}`,
            assignDevice: `${Api}${Controllers.vehicleDevice}/assignDevice`,
            deassignDevice: `${Api}${Controllers.vehicleDevice}/deassignDevice`,
        }
    }
}
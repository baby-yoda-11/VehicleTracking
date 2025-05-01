export const Api = 'api/v1';
export const Controllers = {
    vehicle: '/vehicle',
    device: '/device',
  };
export const Configuration = {
    endPoints:{
        vehicle: {
            getvehicleReferences: `${Api}${Controllers.vehicle}/references`,
            getAllVehicles: `${Api}${Controllers.vehicle}`,
            addVehicle: `${Api}${Controllers.vehicle}`,
            getVehicleById: `${Api}${Controllers.vehicle}/getVehicleById`, 
            updateVehicle: `${Api}${Controllers.vehicle}/updateVehicle`,
            deleteVehicle: `${Api}${Controllers.vehicle}/deleteVehicle`,
        },
        device: {
            getDeviceReferences: `${Api}${Controllers.device}/references`,
            getAllDevices: `${Api}${Controllers.device}/getAllDevices`,
            addDevice: `${Api}${Controllers.device}/addDevice`,
            getDeviceById: `${Api}${Controllers.device}/getDeviceById`,
            updateDevice: `${Api}${Controllers.device}/updateDevice`,
            deleteDevice: `${Api}${Controllers.device}/deleteDevice`,
        },
        vehicleDevice: {
            getUnpairedDevices: `${Api}${Controllers.vehicle}/getUnpairedDevices`,
            getVehicleDevices: `${Api}${Controllers.vehicle}/getVehicleDevices`,
            assignDevice: `${Api}${Controllers.vehicle}/assignDevice`,
            updateDevice: `${Api}${Controllers.vehicle}/updateDevice`
        }
        
    }
}
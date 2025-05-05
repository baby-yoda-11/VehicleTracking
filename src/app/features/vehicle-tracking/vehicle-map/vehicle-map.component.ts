import { Component, effect, inject, Input, signal, SimpleChanges } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { SignalRService } from '../services/signalr.service';
import { VehiclePositionService } from '../services/vehicle-position.service';
import { VehiclePosition } from '../models/vehicle-position.model';

@Component({
  selector: 'app-vehicle-map',
  standalone: false,
  templateUrl: './vehicle-map.component.html',
  styleUrl: './vehicle-map.component.scss'
})
export class VehicleMapComponent {

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal(12);
  activePositions = signal<VehiclePosition[]>([]);
  
  constructor(
    private signalRService: SignalRService,
    private vehiclePositionService : VehiclePositionService
  ) {
    effect(() => {
      const positions: VehiclePosition[] = [];
      positions.push({
        id: 1,
        vehicleId: 1,
        latitude: 17.4062,
        longitude: 78.4691,
        speed: 0,
        heading: 0,
        timestamp: new Date()
      })

      if (positions.length > 0) {
        this.activePositions.set(positions);
        this.center.set({
          lat: positions[0].latitude,
          lng: positions[0].longitude
        });
      }
    });

    effect(() => {
      const update = this.signalRService.positionUpdate();
      if (update) {
        this.activePositions.update(positions => 
          positions.some(p => p.vehicleId === update.vehicleId)
            ? positions.map(p => p.vehicleId === update.vehicleId ? update : p)
            : [...positions, update]
        );
        
        if (update.vehicleId === this.vehicleId) {
          this.center.set({
            lat: update.latitude,
            lng: update.longitude
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.vehiclePositionService.loadPositions(this.vehicleId);
  }

  @Input() vehicleId!: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && changes['vehicleId'].currentValue) {
      console.log('Vehicle ID changed:', this.vehicleId);
      // Add logic to update the map based on the new vehicleId
    }
  }

  getVehicleIcon(heading: number): google.maps.Icon {
    return {
      url: 'assets/car-icon.png',
      scaledSize: new google.maps.Size(32, 32),
     // rotation: heading,
      anchor: new google.maps.Point(16, 16)
    };
  }
}

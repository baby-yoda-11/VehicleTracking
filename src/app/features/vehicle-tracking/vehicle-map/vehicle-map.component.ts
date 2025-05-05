import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-vehicle-map',
  standalone: false,
  templateUrl: './vehicle-map.component.html',
  styleUrl: './vehicle-map.component.scss'
})
export class VehicleMapComponent {
  @Input() vehicleId!: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicleId'] && changes['vehicleId'].currentValue) {
      console.log('Vehicle ID changed:', this.vehicleId);
      // Add logic to update the map based on the new vehicleId
    }
  }
}

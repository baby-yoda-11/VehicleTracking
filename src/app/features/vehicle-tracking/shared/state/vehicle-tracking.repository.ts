import { Injectable } from '@angular/core';
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import { getActiveId, setActiveId, withActiveId } from '@ngneat/elf-entities';
import { withRequestsStatus, selectIsRequestPending, createRequestsStatusOperator } from '@ngneat/elf-requests';
import { IReference } from '../../models/reference';

export interface VehicleTrackingProps {
  vehicleReferences?: IReference[];
  currentId?: number;
  recentId?: number;
}

type RequestKey = 'vehicleTracking';

export const requestKey = 'vehicleTracking';

const store = createStore(
  { name: 'vehicleTracking' },
  withProps<VehicleTrackingProps>({}),
  withActiveId(),
  withRequestsStatus<RequestKey>()
);

export const trackRequestsStatus = createRequestsStatusOperator(store);

@Injectable({ providedIn: 'root' })
export class VehicleTrackingRepository {
  isRequestPending$ = store.pipe(selectIsRequestPending(requestKey));

  vehicleReferences$ = store.pipe(select(state => state.vehicleReferences));
  currentId$ = store.pipe(select(state => state.currentId));

  get currentId() {
    return store.getValue()?.currentId;
  }

  get recentId() {
    return store.getValue()?.recentId;
  }

  get vehicleReferences() {
    return store.getValue()?.vehicleReferences;
  }

  hasActiveId(): boolean {
    return !!store.query(getActiveId);
  }

  IsActiveId(id: string | undefined): boolean {
    return store.query(getActiveId) === id;
  }

  setActiveId(id: string | undefined) {
    store.update(setActiveId(id));
  }

  updateProp(key: keyof VehicleTrackingProps, value: VehicleTrackingProps[keyof VehicleTrackingProps]) {
    store.update(setProp(key, value));
  }

  reset() {
    store.reset();
  }
}

import express from 'express';
import { statusAllElevators, getElevatorStatus, 
  isElevatorAvailable, getRoutes } from './src/scripts/get-elevator.js';
import { updateElevatorStatus, pendingCallsQueue, callElevatorToFloor, processPendingCalls, putRoutes } from './src/scripts/put-elevator.js';
const app = express();
app.use(express.json());

export const elevators = [
  {id: 1,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  },
  {id: 2,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  },
  {id: 3,
  currentFloor: 0,
  status: 'idle',
  destinationFloor: 0
  }
];

getRoutes.forEach(route => {
  app.get(route.path, route.handler);
});

putRoutes.forEach(route => {
  app.put(route.path, route.handler);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default { elevators };
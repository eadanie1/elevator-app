
import { elevators } from "../../app.js";


export let callsQueue = [];

export function findClosestElevator(floor) {
  let closestElevator = null;
  let minDistance = Number.MAX_SAFE_INTEGER;

  elevators.forEach(elevator => {
    if (elevator.status === 'idle') {
      const distance = Math.abs(elevator.currentFloor - floor);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    }
  });

  return closestElevator;
}

export async function moveElevator(elevator) {
  setTimeout(() => {
    elevator.currentFloor = elevator.destinationFloor;
    elevator.status = 'idle';
    elevator.destinationFloor = 0;
    console.log(`Elevator ${elevator.id} reached floor ${elevator.currentFloor}`);
    
    if (callsQueue.length > 0) {
      const call = callsQueue.shift();
      callElevator(call.floor);
    }
  }, Math.abs(elevator.destinationFloor - elevator.currentFloor) * 1000); // Adjust for simulation
}

export async function callElevator(floor) {
  const closestElevator = findClosestElevator(floor);
  if (closestElevator) {
    closestElevator.currentFloor < floor ? closestElevator.status = 'moving_up' : closestElevator.status = 'moving_down';
    closestElevator.destinationFloor = floor;
    moveElevator(closestElevator);
  } else {
    callsQueue.push({ floor });
    console.log(`No idle elevators available. Call queued for floor ${floor}`);
  }
}


export const postRoutes = [
  {
    path: '/api/elevators/call',
    handler: async (req, res) => {
      const { floor } = req.body;
      await callElevator(floor);
      res.json({ message: `Elevator called for floor ${floor}` });
    }
  }
];

export default { callsQueue, findClosestElevator, moveElevator , callElevator, postRoutes };
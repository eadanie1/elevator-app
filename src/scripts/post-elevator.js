import { elevators } from "../../app.js";





export let callsQueue = [];

// Function to find the closest idle elevator to a given floor
export async function findClosestElevator(floor, elevators) {
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

// Handle elevator movement
export async function moveElevator(elevator, elevators) {
  // Simulate the time it takes for the elevator to move
  setTimeout(() => {
    elevator.currentFloor = elevator.destinationFloor;
    elevator.status = 'idle';
    elevator.destinationFloor = 0;
    console.log(`Elevator ${elevator.id} reached floor ${elevator.currentFloor}`);
    
    // Check if there are calls in the queue
    if (callsQueue.length > 0) {
      const call = callsQueue.shift();
      callElevator(call.floor);
    }
  }, Math.abs(elevator.destinationFloor - elevator.currentFloor) * 1000); // Adjust for simulation
}

// Function to handle elevator movement for a call
export async function callElevator(floor, elevators) {
  const closestElevator = findClosestElevator(floor, elevators);
  if (closestElevator) {
    closestElevator.status = 'moving';
    closestElevator.destinationFloor = floor;
    moveElevator(closestElevator, elevators);
  } else {
    callsQueue.push({ floor });
    console.log(`No idle elevators available. Call queued for floor ${floor}`);
  }
}

// // Receive call for elevator
// app.post('/api/elevators/call', async (req, res) => {
//   const { floor } = req.body;
//   await callElevator(floor);
//   res.json({ message: `Elevator called for floor ${floor}` });
// });

export const postRoutes = [
  {
    path: '/api/elevators/call',
    handler: async (req, res) => {
      const { floor } = req.body;
      await callElevator(floor, elevators);
      res.json({ message: `Elevator called for floor ${floor}` });
    }
  }
];

export default { callsQueue, findClosestElevator, moveElevator , callElevator, postRoutes };
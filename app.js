import express from 'express';
import { statusAllElevators, getElevatorStatus, 
  isElevatorAvailable, getRoutes } from './src/scripts/get-elevator.js';
import { updateElevatorStatus, pendingCallsQueue, callElevatorToFloor, processPendingCalls, putRoutes } from './src/scripts/put-elevator.js';
// import { callsQueue, findClosestElevator, moveElevator , callElevator, postRoutes } from './src/scripts/post-elevator.js';
const app = express();
import axios from 'axios';
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





let callsQueue = [];

function findClosestElevator(floor) {
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

function moveElevator(elevator) {
  setTimeout(() => {
    elevator.currentFloor = elevator.destinationFloor;
    elevator.status = 'idle';
    elevator.destinationFloor = 0;
    console.log(`Elevator ${elevator.id} reached floor ${elevator.currentFloor}`);
    
    if (callsQueue.length > 0) {
      const call = callsQueue.shift();
      console.log(call);
      const queuedArray = [];
      queuedArray.push(call.floor);
      callElevator(queuedArray);
    }
  }, Math.abs(elevator.destinationFloor - elevator.currentFloor) * 1000); // Adjust for simulation
}

async function callElevator(floors) {
  console.log(floors);
  if (!Array.isArray(floors)) {
    console.log(floors);
    console.error('Invalid input. Expected an array of floors.');
    return;
  }

  floors.forEach(floor => {
    const closestElevator = findClosestElevator(floor);
    if (closestElevator) {
      (closestElevator.currentFloor < floor) ? closestElevator.status = 'moving_up' : closestElevator.status = 'moving_down';
      closestElevator.destinationFloor = floor;
      moveElevator(closestElevator);
    } else {
      callsQueue.push({ floor });
      console.log(`No idle elevators available. Call queued for floor ${floor}`);
    }
  });
}

async function callElevatorAPI(floors) {
  try {
    const response = await axios.post('http://localhost:3000/api/elevators/call', { floors: floors });
    console.log(response.data);
  } catch (error) {
    console.error('Error calling elevator API:', error.response.data);
  }
}

callElevatorAPI([10, 15, 20, 22, 23, 24]);

app.post('/api/elevators/call', async (req, res) => {
  try {
    const { floors } = req.body;
    if (!Array.isArray(floors)) {
      throw new Error('Invalid input. Expected an array of floors.');
    }

      await callElevator(floors);

    res.json({ message: `Elevators called for floors ${floors.join(', ')}` });
  } catch(err) {
    console.log('Error', err.message);
    res.status(400).json({ error: err.message });
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default { elevators };
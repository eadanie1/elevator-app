import express from 'express';
import { statusAllElevators, getElevatorStatus, 
  isElevatorAvailable, getRoutes } from './src/scripts/get-elevator.js';
import { updateElevatorStatus, pendingCallsQueue, processPendingCalls, callElevatorToFloor, putRoutes } from './src/scripts/put-elevator.js';
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




// app.put('/api/elevators/call-elevator-to/:floor', callElevatorToFloor);

// const pendingCallsQueue = [];

// async function callElevatorToFloor(req, res) {
//   try {
//     let minDifference = Math.abs(elevators[0].currentFloor - parseInt(req.params.floor));
//     let selectedElevator = elevators[0];

//     for (let elevator of elevators) {
//       let currentDifference = Math.abs(elevator.currentFloor - parseInt(req.params.floor));

//       if (currentDifference < minDifference) {
//           minDifference = currentDifference;
//           selectedElevator = elevator;
//       }
//     }

//     if (selectedElevator.currentFloor === req.params.floor) {
//       return res.json({ message: 'Elevator already at that floor' });
//     }
    
//     if (selectedElevator.status === 'idle') {
//       selectedElevator.destinationFloor = req.params.floor;
//     } else {
//       // If the elevator is not idle, store the call in the queue
//       const pendingCall = {
//         floor: req.params.floor,
//         timestamp: Date.now(),
//       };
//       pendingCallsQueue.push(pendingCall);
//       return res.json({ message: 'Elevator assigned. Please wait for the next available idle elevator.' });
//     }
    
//     const direction = (selectedElevator.currentFloor < parseInt(req.params.floor) ? 'moving_up' : 'moving_down');
//     selectedElevator.status = direction;
    
//     setTimeout(() => {
//       selectedElevator.currentFloor = req.params.floor;
//       selectedElevator.status = 'idle';
      
//       // Process pending calls when the elevator becomes idle
//       processPendingCalls(selectedElevator);
      
//       res.json({ message: `Elevator arrived at floor ${selectedElevator.currentFloor}` });
//     }, 15000);
//   } catch (error) {
//     console.error('Error', error.message);
//   }
// }

// function processPendingCalls(elevator) {
//   const nextPendingCall = pendingCallsQueue.shift();
  
//   if (nextPendingCall) {
//     elevator.destinationFloor = nextPendingCall.floor;
//     const direction = (elevator.currentFloor < nextPendingCall.floor) ? 'moving_up' : 'moving_down';
//     elevator.status = direction;
    
//     setTimeout(() => {
//       elevator.currentFloor = nextPendingCall.floor;
//       elevator.status = 'idle';
//       console.log(`Elevator ${elevator.id} arrived at floor ${elevator.currentFloor}`);
      
//       // Recursively process more pending calls if any
//       processPendingCalls(elevator);
//     }, 15000);
//   }
// }

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

export default { elevators };
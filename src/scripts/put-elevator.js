
import { elevators } from "../../app.js";



export async function updateElevatorStatus(elevators, req, res) {
  const elevator = elevators.find(e => e.id === parseInt(req.params.id));
  
  if (!elevator) {
    return res.status(404).json({error: 'No elevator found with that ID'});
  }
  
  if (elevator.currentFloor === req.body.destinationFloor) {
    return res.json({ message: 'Elevator already at that floor' });
  }
  
  locatedElevator.destinationFloor = req.body.destinationFloor;
  
  const direction = (locatedElevator.currentFloor < req.body.destinationFloor ? 'moving_up' : 'moving_down'); 
  locatedElevator.status = direction;
  
  setTimeout(() => {
    locatedElevator.status = 'idle';
    locatedElevator.currentFloor = req.body.destinationFloor;
    locatedElevator.destinationFloor = 0;
    return res.json({ message: `Elevator no ${locatedElevator.id} has arrived at floor ${locatedElevator.currentFloor}`});
  }, 3000);
}

export const putRoutes = [
  {
    path: '/api/elevators/set-floor/:id',
    handler: async (req, res) => {
      try{
        await updateElevatorStatus(elevators, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];


// app.put('/api/elevators/call-elevator-to/:floor', callElevatorToFloor);

// export const pendingCallsQueue = [];

// export async function callElevatorToFloor(req, res) {
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

// export async function processPendingCalls(elevator) {
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


export default { updateElevatorStatus, putRoutes };
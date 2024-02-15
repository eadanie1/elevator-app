
import { elevators } from "../../app.js";


export async function updateElevatorStatus(elevators, req, res) {
  const elevator = elevators.find(e => e.id === parseInt(req.params.id));
  
  if (!elevator) {
    return res.status(404).json({error: 'No elevator found with that ID'});
  }
  
  if (elevator.currentFloor === req.body.destinationFloor) {
    return res.json({ message: 'Elevator already at that floor' });
  }
  
  elevator.destinationFloor = req.body.destinationFloor;
  
  const direction = (elevator.currentFloor < req.body.destinationFloor ? 'moving_up' : 'moving_down'); 
  elevator.status = direction;
  
  setTimeout(() => {
    elevator.status = 'idle';
    elevator.currentFloor = req.body.destinationFloor;
    elevator.destinationFloor = 0;
    return res.json({ message: `Elevator no ${elevator.id} has arrived at floor ${elevator.currentFloor}`});
  }, 2000);
}






export const pendingCallsQueue = [];

export async function processPendingCalls(elevator) {
  const nextPendingCall = pendingCallsQueue.shift();
  
  if (nextPendingCall) {
    elevator.destinationFloor = nextPendingCall.floor;
    const direction = (elevator.currentFloor < nextPendingCall.floor) ? 'moving_up' : 'moving_down';
    elevator.status = direction;
    
    setTimeout(() => {
      elevator.currentFloor = nextPendingCall.floor;
      elevator.status = 'idle';
      console.log(`Elevator ${elevator.id} arrived at floor ${elevator.currentFloor}`);
      
      // Recursively process more pending calls if any
      processPendingCalls(elevator);
    }, 15000);
  }
}

export async function callElevatorToFloor(req, res) {
  
  let idleElevators = elevators.filter(elevator => elevator.status === 'idle')
  
  let minDifference = Math.abs(elevators[0].currentFloor - parseInt(req.params.floor));
  let selectedElevator = elevators[0];
  
  if (idleElevators.length === 0) {
    for (let elevator of elevators) {
      let currentDifference = Math.abs(elevator.destinationFloor - parseInt(req.params.floor));
      if (currentDifference < minDifference) {
        minDifference = currentDifference;
        selectedElevator = elevator;
      }
    }
    console.log('execution has passed through here 1');
    
    if (selectedElevator.destinationFloor === parseInt(req.params.floor)) {
      return res.json({ message: 'Elevator arriving at that floor shortly' });
    }
    console.log('execution has passed through here 2');
    
    // selectedElevator.destinationFloor = parseInt(req.params.floor);
    
    const pendingCall = {
      floor: parseInt(req.params.floor),
      timestamp: Date.now(),
    };
    pendingCallsQueue.push(pendingCall);
    return res.json({ message: 'Elevator assigned. Please wait for the next available idle elevator.' });
    // }
  }

  idleElevators.forEach((elevator, index) => {
      // console.log(idleElevators.length);
      console.log(idleElevators);
      let currentDifference = Math.abs(elevator.currentFloor - parseInt(req.params.floor));
      
      if (currentDifference < minDifference) {
        minDifference = currentDifference;
        selectedElevator = elevator;
      }  
      
      if (selectedElevator.currentFloor === parseInt(req.params.floor)) {
        return res.json({ message: 'Elevator already at that floor' });
      }
      
      idleElevators[index].destinationFloor = parseInt(req.params.floor);
      const direction = (idleElevators[index].currentFloor < parseInt(req.params.floor) ? 'moving_up' : 'moving_down');
      idleElevators[index].status = direction;
      
      console.log(index);
      // if (index !== -1) {
        idleElevators.splice(index, 1);
      // }
  });
    
  setTimeout(() => {
    selectedElevator.currentFloor = parseInt(req.params.floor);
    selectedElevator.status = 'idle';
    selectedElevator.destinationFloor = 0;
    
    processPendingCalls(selectedElevator);
    
    res.json({ message: `Elevator ${selectedElevator.id} arrived at floor ${selectedElevator.currentFloor}` });
  }, 15000);
}



export const putRoutes = [
  {
    path: '/api/elevators/set-floor/:id',
    handler: async (req, res) => {
      try {
        await updateElevatorStatus(elevators, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  },
  {
    path: '/api/elevators/call-elevator-to/:floor',
    handler: async (req, res) => {
      try {
        await callElevatorToFloor(req, res);
      } 
      catch (error) {
        console.error('Error', error.message);
      }
    }    
  }
];



export default { updateElevatorStatus, pendingCallsQueue, processPendingCalls, callElevatorToFloor, putRoutes };
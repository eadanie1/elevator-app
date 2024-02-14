
import { elevators } from "../../app.js";



export async function statusAllElevators(req, res) {
  return elevators;
}

export async function getElevatorStatus(elevators, req, res) {
  const locationAndStatusAll = elevators.map(elevator => ({
    id: elevator.id,
    currentFloor: elevator.currentFloor,
    status: elevator.status
  }));
  res.json(locationAndStatusAll);    
}


export const getRoutes = [
  {
    path: '/api/elevators',
    handler: async (req, res) => {
      const elevatorsList = await statusAllElevators(req, res);
      res.json(elevatorsList);
    }
  },
  {
    path: '/api/elevators/get-elevator-status',
    handler: async (req, res) => {
      try {
        await getElevatorStatus(elevators, req, res);
      }
      catch(error) {
        console.error('Error', error.message);
      }
    }
  }
];




        
// app.get('/api/elevators/availability/:id', isElevatorAvailable);

// async function isElevatorAvailable(req, res) {
//   const elevator = elevators.find(e => e.id === parseInt(req.params.id));
//   if (elevator.status === 'idle') {
//         return res.json({message: `Elevator ${elevator.id} is idle and available for a new call`});
//     } else {
//           return res.json({message: `Elevator ${elevator.id} is busy and unavailable to take a new call`});
//     }
// }
              
              
export default { statusAllElevators, getRoutes, getElevatorStatus };
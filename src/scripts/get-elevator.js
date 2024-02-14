
import { elevators } from "../../app.js";


export async function statusAllElevators() {
  return elevators;
}


export const getRoutes = [
  {
    path: '/api/elevators',
    handler: async (req, res) => {
      const elevatorsList = await statusAllElevators();
      res.json(elevatorsList);
    }
  }
];

// app.get('/api/elevators', async (req, res) => {
//   const elevatorsList = await statusAllElevators();
//   res.json(elevatorsList);
// });

// app.get('/api/elevators/get-elevator-status', getElevatorStatus);

// async function getElevatorStatus(req, res) {
//     try{
//         const allStatusAndCurrentFloor = elevators.map(elevator => ({
//             currentFloor: elevator.currentFloor,
//             status: elevator.status
//         }));
//         res.json(allStatusAndCurrentFloor);
//     }
//     catch(error) {
//         console.error('Error', error.message);
//     }
// }


// app.get('/api/elevators/availability/:id', isElevatorAvailable);

// async function isElevatorAvailable(req, res) {
//     const elevator = elevators.find(e => e.id === parseInt(req.params.id));
//     if (elevator.status === 'idle') {
//         return res.json({message: `Elevator ${elevator.id} is idle and available for a new call`});
//     } else {
//         return res.json({message: `Elevator ${elevator.id} is busy and unavailable to take a new call`});
//     }
// }


export default {  };
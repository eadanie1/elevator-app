const express = require('express');
const app = express();
app.use(express.json());

const elevators = [
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
},
];

app.get('/api/elevators', (req, res) => {
    res.json(elevators);
});

app.get('/api/elevators/get-elevator-status', getElevatorStatus);

async function getElevatorStatus(req, res) {
    try{
        const allStatusAndCurrentFloor = elevators.map(elevator => ({
            currentFloor: elevator.currentFloor,
            status: elevator.status
        }));
        res.json(allStatusAndCurrentFloor);
    }
    catch(error) {
        console.error('Error', error.message);
    }
}

// console.log('Current locations of elevators' , 'Elevator 1:', elevators[0].id, 'Elevator 2:', elevators[1].id, 'Elevator 3:', elevators[2].id);
// console.log('Current locations of elevators:' , 'Elevator 1:', elevators[0].currentFloor, 'Elevator 2:', elevators[1].currentFloor, 'Elevator 3:', elevators[2].currentFloor);
// console.log('Current status of elevators:' , 'Elevator 1:', elevators[0].status, 'Elevator 2:', elevators[1].status, 'Elevator 3:', elevators[2].status);

// app.get('/api/elevators', (req, res) => {
    //     // const elevator = elevators.find(e => e.id === parseInt(req.params.id));
    
    //     // console.log('Current locations of elevators' , 'Elevator 1:', elevators[0].currentFloor, 'Elevator 2:', elevators[1].currentFloor, 'Elevator 3:', elevators[2].currentFloor);
    //     res.json(elevators);
// });

// app.get('/api/elevators/:id', async (req, res) => {
//     const elevator = elevators.find(e => e.id === parseInt(req.params.id));

//     const checkStatus = elevator.status;

// });

// app.post('/api/elevators/call-elevator/:floor', (req, res) => {
//     const elevator = elevators.find(e => e.id === parseInt(req.body.id));
//     elevator.destinationFloor = req.params.id;
// });

// app.post('/api/elevators/call-elevator-to/:id', (req, res) => {
//     try{
//         const elevator = elevators.find(e => e.id === parseInt(req.params.id));
//         elevator.destinationFloor = parseInt(req.body.destinationFloor);
//         setTimeout(() => {
//             elevator.currentFloor = req.body.destinationFloor;
//         }, 4000);
//     }
//     catch(error) {
//         console.error('Error', error.message);
//     }
// });




app.put('/api/elevators/call-elevator-to/:id', callElevatorToFloor); //change back to :floor

async function callElevatorToFloor(req, res) {
    try{
        // somehow iterate over the elevators, and use some method
        // to find the one whose currentFloor is the least in difference to what is called
        // absolute value somehow of (currentFloor-parseInt(req.params.floor))/2 
        // not div by 2? but similar, then take the minimum of all three elements, 
        // and will take the first one that satisfies, if two are same, it should
        // take the first one it finds (dont think need div by 2 or anything, as it
        // will get me the delta difference in floors)

        // ask GPT if there's a method to get smallest delta, before that iterate
        // over the three elements currentFloor properties, to find which is smallest

        const elevator = elevators.find(e => e.id === parseInt(req.params.id));
        // elevator.destinationFloor = parseInt(req.body.destinationFloor);
        
        const direction = (elevator.currentFloor < parseInt(req.params.floor) ? 'moving_up' : 'moving_down'); 
        elevator.status = direction;
        res.json({status: elevator.status});
        setTimeout(() => {
            // res.json(elevator.currentFloor = req.body.destinationFloor);
        }, 4000);
    }
    catch(error) {
        console.error('Error', error.message);
    }
}




app.put('/api/elevators/set-floor/:id', updateElevatorStatus);

async function updateElevatorStatus(elevatorId, status, destinationFloor, req, res) {
    try{
        const elevator = elevators.find(e => e.id === parseInt(req.params.id));
        elevator.destinationFloor = parseInt(req.body.destinationFloor);
        setTimeout(() => {
            res.json(elevator.currentFloor = req.body.destinationFloor);
        }, 4000);
    }
    catch(error) {
        console.error('Error', error.message);
    }
}

// async function getElevatorStatus(req, res) {
//     console.log(`Elevator ${id}`);
//     setTimeout(() => {
        
//     }, 4000);
// }

// function callElevatorToFloor(floor) {

// }

// function updateElevatorStatus(elevatorId, status, destinationFloor) {

// }

// function isElevatorAvailable(elevatorId) {

// }

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
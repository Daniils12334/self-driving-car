const carCanvas = document.getElementById("carCanvas");
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50,"AI", 2.5);

const N = 1000;
const cars=generateCars(N)
let bestCar=cars[0];
if (localStorage.getItem("bestBrain")) {
    const savedBrain = JSON.parse(localStorage.getItem("bestBrain"));
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(JSON.stringify(savedBrain));
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}


const traffic = generateTraffic(road, 150);

function generateTraffic(road, count = 10, spacing = 200, minSpeed = 1.8, maxSpeed = 2.3) {
    const traffic = [];
    let y = -100; 

    for (let i = 0; i < count; i++) {
        
        const lane = Math.floor(Math.random() * 3);

        
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);

        
        traffic.push(
            new Car(
                road.getLaneCenter(lane),
                y,
                30, 50,
                "DUMMY",
                speed
            )
        );

        
        y -= spacing + Math.random() * 100; 
    }

    return traffic;
}



animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate() {
    for(let i = 0;i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;


    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for(let i = 0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i = 0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true)
    carCtx.restore();

    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
}

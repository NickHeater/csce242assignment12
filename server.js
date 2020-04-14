const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());

let rallyCars = [
    {id:1, name:"Peugeot 205 T16", horsepower:"460-550", weight:"910kg", config:"Four-wheel drive"},
    {id:2, name:"Audi Quattro", horsepower:"450-590", weight:"1100kg", config:"Four-wheel drive"},
    {id:3, name:"Porsche 959", horsepower:"444", weight:"1450kg", config:"Four-wheel drive"},
    {id:4, name:"Ferrari 288 GTO", horsepower:"395", weight:"1160kg", config:"Rear-wheel drive"},
    {id:5, name:"Ford RS200", horsepower:"444", weight:"1050kg", config:"Four-wheel drive"},
    {id:6, name:"Lancia Delta S4", horsepower:"480", weight:"950kg", config:"Four-wheel drive"}
];

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/rallyCars', (req,res)=>{
    res.send(rallyCars);
});

app.get('/api/rallyCars/:id', (req,res)=>{
    const rallycar = rallyCars.find(r => r.id === parseInt(req.params.id));

    if(!rallycar) res.status(404).send("Rally Car with given id was not found");

    res.send(rallycar);
});

app.post('/api/rallyCars', (req,res)=>{
    const result = validateRallyCar(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const rallycar = {
        id:rallyCars.length+1,
        name:req.body.name,
        horsepower:req.body.horsepower,
        weight:req.body.weight,
        config:req.body.config
    };

    rallyCars.push(rallycar);
    res.send(rallycar);
});

app.put('/api/rallyCars/:id' ,(req,res)=>{
    const rallycar = rallyCars.find(r=>r.id === parseInt(req.params.id));

    if(!rallycar) res.status(404).send("Rally Car with given id was not found");

    const result = validateRallyCar(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    rallycar.name = req.body.name;
    rallycar.horsepower = req.body.horsepower;
    rallycar.weight = req.body.weight;
    rallycar.config = req.body.config;
    res.send(rallycar);
});

app.delete('/api/rallyCars/:id',(req,res)=>{
    const rallycar = rallyCars.find(r=>r.id === parseInt(req.params.id));

    if(!rallycar){
        req.status(404).send("This Rally car was not found");
    }

    const index = rallyCars.indexOf(rallycar);
    rallyCars.splice(index,1);

    res.send(rallycar);
})

function validateRallyCar(rallyCars){
    const schema = {
        name:Joi.string().min(3).required(),
        horsepower:Joi.string().min(3).required(),
        weight:Joi.string().min(3).required(),
        config:Joi.string().min(3).required()
    };

    return Joi.validate(rallyCars,schema);
}

app.listen(3000, ()=>{
    console.log("listening on port 3000")
});




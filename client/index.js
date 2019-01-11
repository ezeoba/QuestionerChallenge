var express=require("express");
var app=express();

var bodyParser=require("body-parser");

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//var urlencodedParser = bodyParser.urlencoded({ extended: false })


var meetups = require("./meetups.json");
var questions = require("./questions.json");

// console.log("Hello World");
// console.log(meetups[0].topic);

/************************************** //GET /meetups/  *************************/
app.get('/api/v1/meetups', function(req, res) {
    //res.send("Hello World");
    //res.status(200).send(meetups);
    res.send({"status":200, "data": meetups});
});

/*************************************** //GET /meetups/<meetup-id> **************/
app.get('/api/v1/meetups/:id', function (req, res) {
    var id = parseInt(req.params.id);
    meetups.map(x=>{
            if (x.id === id) {
                res.send({"status":200, "data": x});
            }
        }    
    );

    //If it does not find the specific id
    res.send({ "status": 404, "error": "meetup does not exist" });
});


/************************************* //POST /meetups/ ************************/
app.post('/apimeetups/v1/', function (req, res) {
    if(!req.body.location){
        res.send({"status": 400, "error": "the location field is required"});
    }else if(!req.body.images){
        res.send({"status":400, "error": "at least one image is required"});
    }else if(!req.body.topic){
        res.send({"status":400, "error": "the topic field is required"});
    }else if(!req.body.happening_on){
        res.send({"status":400, "error": "the happening on field is required"});
    }else if(!req.body.tags){
        res.send({"status":400, "error": "at leat one tag is required"});
    }

    var new_meetup={
        "id" : meetups.length + 1,
        "createdOn": new Date(),
        "location": req.body.location,
        "images": req.body.images,
        "topic": req.body.topic,
        "happeningOn": req.body.happening_on,
        "tags": req.body.tags
    };

    meetups.push(new_meetup);

    //Now, get the last meetup that was created
    //Clone it - with Object.assign
    //...and assign it to a variable called "meetup"
    var meetup=Object.assign({}, meetups[meetups.length-1]);

    //Delete some properties from it
    delete meetup.id;
    delete meetup.createdOn;
    delete meetup.images;
    
    //console.log(req);

    res.send({ "status": 200, "data": [meetup] });
});


/**************************** //GET /questions/ ***************************/
app.get('/api/v1/questions', function (req, res) {
    //res.send("Hello World");
    //res.status(200).send(meetups);
    res.send({ "status": 200, "data": questions });
});

/***************** //POST /questions/  ****************************************/
app.post('/api/v1/questions', function (req, res) {
    if (!req.body.created_by) {
        res.send({ "status": 400, "error": "the created by field is required" });
    } else if (!req.body.meetup) {
        res.send({ "status": 400, "error": "the meetup field is required" });
    } else if (!req.body.title) {
        res.send({ "status": 400, "error": "the title body is required" });
    } else if (!req.body.body) {
        res.send({ "status": 400, "error": "the body field is required" });
    }

    var new_question = {
        "id": questions.length + 1,
        "createdOn": new Date(),
        "createdBy": req.body.created_by,
        "meetup": req.body.meetup,
        "title": req.body.title,
        "body": req.body.body,
        "votes": req.body.votes
    };

    questions.push(new_question);

    //Now, get the last meetup that was created
    //Clone it - with Object.assign
    //...and assign it to a variable called "meetup"
    var question = Object.assign({}, questions[questions.length - 1]);

    //Delete some properties from it
    delete question.id;
    question.user = question.createdBy;
    delete question.createdBy;
    delete question.createdOn;
    delete question.votes;

    //console.log(req);

    res.send({ "status": 200, "data": [question] });
});

/***************** //GET /meetups/upcoming  ****************************************/
// app.get('/api/v1/meetups/upcoming', function (req, res) {

// });

//SERVER
var server = app.listen(80, "localhost", function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log(__dirname);

    console.log("Listening on port "+ port + " on address "+ host);
});
// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
//var Llama = require('./models/llama');
var user_model = require('./models/user');
var task_model = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://admin:password@ds053419.mongolab.com:53419/mp3-database');
var User =  mongoose.model('User');
var Task = mongoose.model('Task');

User.on('error', function(err){
  return err;
});
Task.on('error', function(err){
  return err;
});

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// parse application/json
//app.use(bodyParser.json());



// All our routes will start with /api
app.use('/api', router);

var users_route = router.route('/users');
var users_id_route = router.route('/users/:id');
var tasks_route = router.route('/tasks');
var tasks_id_route = router.route('/tasks/:id')


users_route.get(function(req, res){
  var query = User.find();
  //function (err, users) {
    //  if (err) {
    //    return res.status(500).json({message: handle_error(err), data:[]});
    //  }
    // users;
    //});
  //console.log(query);
  if(req.query) {
    for (var q in req.query) {
      if (q == 'where') {
        query.find(eval("("+req.query.where+")"), function (err, ret) {
          if (err) {
            return res.status(500).json({message: handle_error(err), data: []});
          }
          query = ret;
        });
      } else if (q == 'sort') {
        query = query.sort(eval("("+req.query.sort+")"));
      } else if (q == 'skip') {
        query = query.skip(eval("("+req.query.skip+")"));
      } else if (q == 'limit') {
        query = query.limit(eval("("+req.query.limit+")"));
      } else if (q == 'select'){
        query = query.select(eval("("+req.query.select+")"));
      }
    }
    if(req.query.count){
      query.count(function(err, c){
        if(err) return res.status(500).json({message: handle_error(err), data:[]});
        return res.status(200).json({message: "Count", data:c});
      });
    }
  }
  query.exec(function(err, ret){
    if(err) return res.status(500).json({message: handle_error(err), data:[]});
    return res.status(200).json({message:"OK", data:ret});
  })


  //if (req.query){
  //  var query_string = "";
  //
  //}
});

users_route.post(function(req, res){
  var user = new User({
    name: req.body.name,
    email: req.body.email
  });
  user.save(function(err){
    if(err){
      if(err.code == 11000){
        res.status(500).json({message:"This email already exists", data:[]});
      } else {
        res.status(500).json({message: handle_error(err), data:[]});
      }
    } else{
      res.status(201).json({message: "User Added", data:[user]});
    }
  });
});

users_route.options(function(req, res){
  res.writeHead(200);
  res.end();
});


function handle_error(err){
  var ret_string = "";
  for(var e in err.errors){
    ret_string += err.errors[e].name + ": " + err.errors[e].message + "! "
  }
  return ret_string;
}

/*
//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route 
var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});
*/

//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port); 
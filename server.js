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
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
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
var tasks_id_route = router.route('/tasks/:id');


tasks_route.get(function(req, res){
  getFunction(Task, req, res);
});

tasks_route.post(function(req, res){
  if(!req.body.name && req.body.deadline){
    return res.status(500).json({message: "Validation Error: A name is required!", data: []});
  } else if(req.body.name && !req.body.deadline) {
    return res.status(500).json({message: "Validation Error: A deadline is required!", data: []});
  } else if(!req.body.name && !req.body.deadline) {
    return res.status(500).json({message: "Validation Error: A deadline is required! A name is required!", data: []});
  } else {
    var task = new Task();
    task.name = req.body.name;
    task.deadline = req.body.deadline;
    if(req.body.description) task.description = req.body.description;
    if(req.body.completed) task.completed = req.body.completed;
    if(req.body.assignedUser) task.assignedUser = req.body.assignedUser;
    if(req.body.assignedUserName) task.assignedUserName = req.body.assignedUserName;
    task.save(function(err){
      if(err){
          res.status(500).json({message: handle_error(err), data:[]});
      } else{
        res.status(201).json({message: "Task Added", data:task});
      }
    });
  }

});

tasks_id_route.get(function(req, res){
  Task.findOne({_id: req.params.id}, function(err, user){
    if (err || user == null) {
      return res.status(404).json({message: "Task Not Found", data: []});
    }
    res.status(200).json({message:'OK', data: user});
  });
});

tasks_id_route.put(function(req, res){
  if(!req.body.name && req.body.deadline){
    return res.status(500).json({message: "Validation Error: A name is required!", data: []});
  } else if(req.body.name && !req.body.deadline) {
    return res.status(500).json({message: "Validation Error: A deadline is required!", data: []});
  } else if(!req.body.name && !req.body.deadline) {
    return res.status(500).json({message: "Validation Error: A deadline is required! A name is required!", data: []});
  } else {
    Task.findOne({_id: req.params.id}, function(err, task){
      if(err || task == null){
        return res.status(404).json({message: "Task Not Found", data: []});
      } else{
        task.name = req.body.name;
        task.deadline = req.body.deadline;
        console.log(req.body);
        console.log(req.body.assignedUser == null);
        console.log(req.body.contains(assignedUser));
        console.log('assignedUser' in req.body);
        console.log('description' in req.body);
        if(req.body.description) task.description = req.body.description;
        if(req.body.completed) task.completed = req.body.completed;
        if(req.body.assignedUser) task.assignedUser = req.body.assignedUser;
        if(req.body.assignedUserName) task.assignedUserName = req.body.assignedUserName;
        task.save(function(err){
          if(err){
            res.status(500).json({message: handle_error(err), data:[]});
          } else{
            res.status(201).json({message: "Task Updated", data:task});
          }
        });
      }
    });
  }
});

tasks_id_route.delete(function(req, res){
  Task.findOneAndRemove({_id: req.params.id}, function(err, user){
    if (err || user == null) {
      return res.status(404).json({message: "Task Not Found", data: []});
    }
    res.status(200).json({message:'Task Deleted', data:[]})
  });
});

users_id_route.get(function(req, res){
  User.findOne({_id: req.params.id}, function(err, user){
    if (err || user == null) {
      return res.status(404).json({message: "User Not Found", data: []});
    }
    res.status(200).json({message:'OK', data: user});
  });
});

users_id_route.put(function(req, res){
  var args = req.body.pendingTasks ? {name: req.body.name, email: req.body.email, pendingTasks: req.body.pendingTasks} : {name: req.body.name, email: req.body.email};
  User.findByIdAndUpdate(req.params.id, args, function(err, user){
    if (err || user == null) {
      if(req.body.name && !req.body.email){
        return res.status(500).json({message: "Validation Error: An email is required!", data: []})
      } else if(req.body.email && !req.body.name) {
        return res.status(500).json({message: "Validation Error: A name is required!", data: []})
      } else if (!req.body.email && !req.body.name){
        return res.status(500).json({message: "Validation Error: A name is required! An email is required!", data: []})
      } else {
        return res.status(404).json({message: "User Not Found", data: []});
      }

    }
    res.status(200).json({message:'User Updated', data: user});
  });
});


users_id_route.delete(function(req, res){
  User.findOneAndRemove({_id: req.params.id}, function(err, user){
    if (err || user == null) {
      return res.status(404).json({message: "User Not Found", data: []});
    }
    res.status(200).json({message:'User Deleted', data:[]})
  });
});

users_route.get(function(req, res){
  getFunction(User, req, res);
});


var getFunction = function(model, req, res){
  var query = model.find();
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
}

users_route.post(function(req, res){
  var user = new User({
    name: req.body.name,
    email: req.body.email
  });
  if(req.body.pendingTasks) user.pendingTasks = req.body.pendingTasks;
  user.save(function(err){
    if(err){
      if(err.code == 11000){
        res.status(500).json({message:"This email already exists", data:[]});
      } else {
        res.status(500).json({message: handle_error(err), data:[]});
      }
    } else{
      res.status(201).json({message: "User Added", data:user});
    }
  });
});

users_route.options(function(req, res){
  res.writeHead(200);
  res.end();
});

tasks_route.options(function(req, res){
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



// Start the server
app.listen(port);
console.log('Server running on port ' + port); 
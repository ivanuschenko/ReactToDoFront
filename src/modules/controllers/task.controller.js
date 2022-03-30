const Task = require('../../db/models/task/index');

module.exports.getAllTasks = (req, res, next) => {
  Task.find().then(result => {
    res.send(result);    
  });
};

module.exports.createNewTask = (req, res, next) => {
  const task = new Task(req.body);
  task.save().then(result => {  
    res.send(task);
  }).catch(err => console.log(err));
 };

module.exports.changeTaskInfo = (req, res, next) => {
  const bodyId = req.body._id;
  Task.updateOne({_id: bodyId}, req.body).then(result => {
    Task.find().then(result => {
      res.send(result);
    });
  });
};

module.exports.deleteTask = (req, res, next) => {
  const queryId = req.query._id;
  Task.deleteOne({_id: queryId}).then(result => { 
    Task.find().then(result => {          
      res.send(result);                 
    });   
  });
};

module.exports.deleteAll = (req, res, next) => {
  Task.remove({}).then(result => {
    res.send('deleted all!');
  });
};
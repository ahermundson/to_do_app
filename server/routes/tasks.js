var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';




router.get('/', function(req, res) {
  console.log("get request");
  // get books from database
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks ORDER BY complete', function(err, result){
      done(); ///close the connection.

      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      console.log(result);
      res.send(result.rows);
    });

  });
});


router.post('/', function(req, res) {
  var newTask = req.body.task;
  pg.connect(connectionString, function(err, client,done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query('INSERT INTO tasks (task, complete)' +
    'VALUES ($1, $2)',
    [newTask, 'false'],
    function(err, result) {
      done();
      if (err) {
        console.log('insert query error: ', err);
        res.sendStatus(500);
      } else {
      res.sendStatus(201);
      }
    });
  });
});

router.delete('/:id', function(req, res) {
  var taskId = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query('DELETE FROM tasks WHERE id = $1',
    [taskId],
    function(err, result) {
      done(); //close connection
      if(err) {
        console.log('delete error');
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });
  });
});

module.exports = router;;

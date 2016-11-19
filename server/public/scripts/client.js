$(document).ready(function() {
  console.log("ready");
  getTasks();
  $('#taskForm').on('submit', postTask);
  $('.task-table').on('click', '#delete', deleteTask);
  $('.task-table').on('click', '#complete', completeTask);
});



function postTask() {
  event.preventDefault();
  var taskObject = {};
  taskObject.task = $('#task').val();
  console.log('task console: ', task);
  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: taskObject,
    success: function() {
      console.log('Succesfully posted');
      getTasks();
    },
    error: function() {
      console.log("Failed to post task");
    }
  });
}


function getTasks() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: function(tasks) {
      appendTasks(tasks);
    },
    error: function() {
      console.log('error in get tasks request');
    }
  });
}


function appendTasks(tasks) {
  $('.task-table').empty();
  for (var i = 0; i < tasks.length; i++) {
    if(tasks[i].complete === 'true') {
      $('.task-table').append('<tr class="table-row completed" data-id="' + tasks[i].id + '">' +
      '<td>' + tasks[i].task + '<button id="complete">Completed</button><button id="delete">Delete</button></td></tr>');
    } else {
      $('.task-table').append('<tr class="table-row" data-id="' + tasks[i].id + '">' +
      '<td>' + tasks[i].task + '<button id="complete">Completed</button><button id="delete">Delete</button></td></tr>');
    }
  }
}

function deleteTask() {
  var id = $(this).closest('tr').data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + id,
    success: function(result) {
      //get tasks from database and reappend
      getTasks();
    },
    error: function(result) {
      console.log('could not delete pet.');
    }
  });
}

function completeTask() {
  var id = $(this).closest('tr').data('id');
  $(this).closest('tr').addClass('completed');
  console.log(id);
  $.ajax({
    type: 'PUT',
    url: '/tasks/' + id,
    success: function() {
      console.log('Succesfully posted');
      getTasks();
    },
    error: function() {
      console.log("Failed to post task");
    }
  });
}

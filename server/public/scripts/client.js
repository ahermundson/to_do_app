$(document).ready(function() {
  console.log("ready");
  getTasks();
  setTimeout(toComplete, 1000);
  $('#taskForm').on('submit', postTask);
  $('.task-table').on('click', '#delete', deleteTaskPrompt);
  $('.task-table').on('click', '#complete', completeTask);
  $('#deleteConfirmed').on('click', deleteTask);
  $('#cancelDelete').on('click', function() {
    $('.confirm-delete').fadeOut('slow');
  });
});

var tasksToComplete = 0;

function postTask() {
  event.preventDefault();
  var taskObject = {};
  taskObject.task = $('#task').val();
  if (taskObject.task.length <= 100) {
    $('#task').val('');
    $('#task').blur();
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
  } else {
    alert("Your task is too long.");
  }
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
  tasksToComplete = 0;
  $('.task-table').empty();
  for (var i = 0; i < tasks.length; i++) {
    if(tasks[i].complete === 'true') {
      $('.task-table').append('<tr class="table-row completed" data-id="' + tasks[i].id + '">' +
      '<td>' + tasks[i].task + '<span id="table_buttons"><img id="delete" src="../assets/delete.png" /></span></td></tr>');
    } else {
      tasksToComplete++;
      $('.task-table').append('<tr class="table-row" data-id="' + tasks[i].id + '">' +
      '<td>' + tasks[i].task + '<span id="table_buttons"><img id="complete" src="../assets/checkmark.png" /><img id="delete" src="../assets/delete.png" /></span></td></tr>');
    }
  }
}

function deleteTask() {
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + id,
    success: function(result) {
      //reappend tasks to DOM and show delete confirmation message
      getTasks();
      deleteCompleted();
    },
    error: function(result) {
      console.log('could not delete pet.');
    }
  });
  $('.confirm-delete').fadeOut('slow');
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

function deleteTaskPrompt() {
  $('.confirm-delete').css('visibility','visible').hide().slideDown();
  id = $(this).closest('tr').data('id');
}

function deleteCompleted() {
  $('.delete-complete').css('visibility','visible').hide().slideDown();
  setTimeout(slideUpDeleteComplete, 2000);
}

function slideUpDeleteComplete() {
  $('.delete-complete').slideUp();
}

function toComplete() {
  $('.inner-toComplete').append('<p>Welcome back. You have ' + tasksToComplete + ' tasks to complete.');
  $('.to-complete').css('visibility','visible').hide().slideDown();
  setTimeout(slideUpToComplete, 2000);
}

function slideUpToComplete() {
  $('.to-complete').slideUp();
}

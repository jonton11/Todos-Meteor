// Client

Todos = new Meteor.Collection('todos');

Template.todos.helpers({
  'todo': function() {
    return Todos.find({}, {sort: {createdAt: -1}});
  }
});

Template.todos.events({
  'submit form': function(event){
    event.preventDefault();
    var todoName = $('[name="todoName"]').val();
    Todos.insert({
      name: todoName,
      completed: false,
      createdAt: new Date()
    });
    $('[name="todoName"]').val('');
  },
  'click .delete-todo': function(event) {
    event.preventDefault();
    var documentId = this._id;
    var confirm = window.confirm("Delete this task?");
    if (confirm) {
      Todos.remove({_id: documentId});
    }
  }
});

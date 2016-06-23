// Client

// Collections (Models)
//--------------------------------------------------------------------------
Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

// Helpers
//--------------------------------------------------------------------------
Template.todos.helpers({
  'todo': function(){
    var currentList = this._id;
    var currentUser = Meteor.userId();
    return Todos.find({ listId: currentList, createdBy: currentUser }, {sort: {createdAt: -1}});
  }
});

Template.todoItem.helpers({
  'checked': function(){
    var isCompleted = this.completed;
    if (isCompleted) {
      return "checked";
    } else {
      return "";
    }
  }
});

Template.todoCount.helpers({
  'totalTodos': function() {
    var currentList = this._id;
    return Todos.find({listId: currentList}).count();
  },
  'completedTodos': function() {
    var currentList = this._id;
    return Todos.find({listId: currentList, completed: true}).count();
  }
});

Template.lists.helpers({
  'list': function() {
    var currentUser = Meteor.userId();
    return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
  }
})

// Events
//--------------------------------------------------------------------------
Template.todos.events({
  'submit form': function(event){
    event.preventDefault();
    var todoName = $('[name="todoName"]').val();
    var currentUser = Meteor.userId();
    var currentList = this._id;
    Todos.insert({
      name: todoName,
      completed: false,
      createdAt: new Date(),
      createdBy: currentUser,
      listId: currentList
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
  },
  'keyup [name=todoItem]': function(event){
    if (event.which == 13 || event.which == 27) {
      $(event.target).blur();
      // Utilize enter and esc keys to remove focus effect
    } else {
      var documentId = this._id;
      var todoItem = $(event.target).val();
      Todos.update({_id: documentId}, {$set: { name: todoItem }});
    }
  },
  'change [type=checkbox]': function() {
    var documentId = this._id;
    var isCompleted = this.completed;
    if (isCompleted) {
      Todos.update({_id: documentId}, {$set: {completed: false}});
    } else {
      Todos.update({_id: documentId}, {$set: {completed: true}});
    }
  }
});

Template.addList.events({
  'submit form': function(event){
    event.preventDefault();
    var listName = $('[name=listName]').val();
    var currentUser = Meteor.userId();
    Lists.insert({
      name: listName,
      createdBy: currentUser
    }, function(error, results) {
      Router.go('listPage', { _id: results });
    });
    $('[name=listName]').val('');
  }
});

Template.register.events({
  'submit form': function(event){
    event.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    Accounts.createUser({
      email: email,
      password: password
    }, function(error){
      if (error) {
        console.log(error.reason);
      } else {
        Router.go("home");
      }
    });
    Router.go('home');
  }
});

Template.navigation.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
})

Template.login.events({
  'submit form': function(event) {
    event.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(email, password, function(error) {
      if (error) {
        console.log(error.reason);
      } else {
        var currentRoute = Router.current().route.getName();
        if (currentRoute == "login") {
          Router.go('home');
        }
      }
    });
  }
})

// Client
// 'Subscribe' to the 'publication' of the server for security
// This is so anyone cannot add/remove items from the db via console
// => We moved function this into router.js to only load necessary data

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
  }
});

// Template Hooks
$.validator.setDefaults({
  rules: {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true,
      minlength: 6
    },
    messages: {
      email: {
        required: "You must enter an email address",
        email: "You've entered an invalid email address"
      },
      password: {
        required: "You must enter a password",
        minlength: "Your password must be at least {0} characters long"
      }
    }
  }
});

Template.login.onRendered(function() {
  var validator = $('.login').validate({
    submitHandler: function(event){
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
          if (error.reason == "User not found") {
            validator.showErrors({
              email: "That email doesn't belong to a registered user"
            });
          }
          if (error.reason == "Incorrect password") {
            validator.showErrors({
              password: "You entered an incorrect password"
            });
          }
        } else {
          var currentRoute = Router.current().route.getName();
          if (currentRoute == "login") {
            Router.go('home');
          }
        }
      });
    }
  });

});

Template.register.onRendered(function() {
  var validator = $('.register').validate({
    submitHandler: function(event) {
      var email = $('[name=email]').val();
      var password = $('[name=password]').val();
      Accounts.createUser({
        email: email,
        password: password
      }, function(error) {
        if (error) {
          if (error.reason == "Email already exists.") {
            validator.showErrors({
              email: "That email is taken"
            });
          }
        } else {
          Router.go("home");
        }
      });
    }
  });
});

Template.lists.onCreated(function() {
   this.subscribe('lists');
})

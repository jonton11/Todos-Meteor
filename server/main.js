// Server

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

// Manage invalid list name
function defaultName(currentUser) {
  var nextLetter = 'A';
  var nextName = 'List ' + nextLetter;
  while (Lists.findOne({ name: nextName, createdBy: currentUser })) {
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'List ' + nextLetter;
  }
  return nextName;
}

// "Publish" a collection so that the client can 'subscribe' to it
// This is for security reasons
Meteor.publish('lists', function() {
  var currentUser = this.userId;
  return Lists.find({ createdBy: currentUser });
});

Meteor.publish('todos', function(currentList) {
  var currentUser = this.userId;
  return Todos.find({ createdBy: currentUser, listId: currentList });
});

// Collections
Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

// Methods
Meteor.methods({
  'createNewList': function(listName) {
    var currentUser = Meteor.userId();
    check(listName, String);
    if (listName == "") {
      listName = defaultName(currentUser);
    }
    var data = {
      name: listName,
      createdBy: currentUser
    }
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged in.");
    }
    return Lists.insert(data);
  },
  'createListItem': function(todoName, currentList) {
    check(todoName, String);
    check(currentList, String);
    var currentUser = Meteor.userId();
    var data = {
      name: todoName,
      completed: false,
      createdAt: new Date(),
      createdBy: currentUser,
      listId: currentList
    }
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged in.");
    }
    var currentList = Lists.findOne(currentList);
    if (currentList.createdBy != currentUser) {
      throw new Meteor.Error("invalid-user", "You don't own that list");
    }
    return Todos.insert(data);
  },
  'editListItem': function(documentId, todoItem) {
    check(todoItem, String);
    var currentUser = Meteor.userId();
    var data = {
      _id: documentId,
      createdBy: currentUser
    }
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged in.");
    }
    return Todos.update(data, {$set: { name: todoItem }});
  },
  'completeListItem': function(documentId, isCompleted) {
    check(isCompleted, Boolean);
    var currentUser = Meteor.userId();
    var data = {
      _id: documentId,
      createdBy: currentUser
    }
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged in.");
    }
    if (isCompleted) {
      return Todos.update(data, {$set: {completed: false}});
    } else {
      return Todos.update(data, {$set: {completed: true}});
    }
  },
  'deleteListItem': function(documentId) {
    var currentUser = Meteor.userId();
    var data = {
      _id: documentId,
      createdBy: currentUser
    }
    if (!currentUser) {
      throw new Meteor.Error("not-logged-in", "You're not logged in.");
    }
    return Todos.remove(data);
  }
});

// TODO: Twitter OAuth
// Accounts.loginServiceConfiguration.remove({
//   service: "twitter"
// });
// Accounts.loginServiceConfiguration.insert({
//   service: "twitter",
//   consumerKey: "VSbtq8ciL5W7BgVhbyxbpJU2W",
//   secret: "SzxuWy8EXP84QHm9Fu8KsUTJpupvK7s90bCR0QAywaeOWXQ1OH"
// });

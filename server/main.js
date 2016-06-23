// Server

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

// "Publish" a collection so that the client can 'subscribe' to it
// This is for security reasons
Meteor.publish('lists', function() {
  var currentUser = this.userId;
  return Lists.find({ createdBy: currentUser });
});

Meteor.publish('todos', function(currentList) {
  var currentUser = this.userId;
  return Todos.find({ createdBy: currentUser, listId: currentList });
})

// Collections
Todos = new Meteor.Collection('todos');
Lists = new Meteor.Collection('lists');

// TODO: Twitter OAuth
// Accounts.loginServiceConfiguration.remove({
//   service: "twitter"
// });
// Accounts.loginServiceConfiguration.insert({
//   service: "twitter",
//   consumerKey: "VSbtq8ciL5W7BgVhbyxbpJU2W",
//   secret: "SzxuWy8EXP84QHm9Fu8KsUTJpupvK7s90bCR0QAywaeOWXQ1OH"
// });

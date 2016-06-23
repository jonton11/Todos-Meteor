// Server

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup

});

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

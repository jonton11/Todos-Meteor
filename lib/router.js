// Which template for all pages
Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

// Define home page
Router.route('/', {
  name: 'home',
  template: 'home',
  // Use 'waitOn' instead of 'subscriptions' so all the data from subscribe() will load before the page does
  // It renders 'loading' in the meantime
  waitOn: function() {
    return Meteor.subscribe('lists');
  }
});

// Pages that don't need params passed through
Router.route('/register');
Router.route('/login');

// List show page, pass through _id as parameter
Router.route('/list/:_id', {
  name: 'listPage',
  template: 'listPage',
  data: function() {
    var currentList = this.params._id;
    var currentUser = Meteor.userId();
    return Lists.findOne({ _id: currentList, createdBy: currentUser });
  },
  // onBeforeAction is a hook => we can execute code when code for a route is "executed"
  onBeforeAction: function() {
    var currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render("login");
    }
  },
  // We can control what subscriptions are available at specific routes
  waitOn: function() {
    var currentList = this.params._id;
    return Meteor.subscribe('todos', currentList);
  }
});

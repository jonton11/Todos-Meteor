// Which template for all pages
Router.configure({
  layoutTemplate: 'main'
});

// Define home page
Router.route('/', {
  name: 'home',
  template: 'home'
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
  onRun: function() {
    // console.log("You triggered 'onRun' for 'listPage' route.");
    this.next();
  },
  onRerun: function() {
    // console.log("You triggered 'onRerun' for 'listPage' route.");
  },
  // onBeforeAction is a hook => we can execute code when code for a route is "executed"
  onBeforeAction: function() {
    // console.log("You triggered 'onBeforeAction' for 'listPage' route.");
    var currentUser = Meteor.userId();
    if (currentUser) {
      this.next();
    } else {
      this.render("login");
    }
  },
  onAfterAction: function() {
    // console.log("You triggered 'onAfterAction' for 'listPage' route.");
  },
  onStop: function() {
    // console.log("You triggered 'onStop' for 'listPage' route.");
  }
});

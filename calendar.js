// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone.localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------
  // Our basic **Todo** model has `title`, `order`, and `done` attributes.
  var Day = Backbone.Model.extend({
	getClass:function(monthIndex){
		if(!this.isInMonth(monthIndex)){
			return "outMonth";
		}
		if(this.isToday()){
			return "today";
		}
		if(this.isWeekend()){
			return "weekend";
		}
		return "white";
		
	},
	isToday: function(MonthIndex){
		var today = new Date();
		return this.date.getDate()==today.getDate()&&this.date.getMonth()==today.getMonth();
	},
	isInMonth: function(MonthIndex){
		return this.date.getMonth()==MonthIndex;
	},
	isWeekend: function(){
		return this.date.getDay()==6||this.date.getDay()==0;
	}, 
	defaults: function() {
      return {
        date : new Date(),
		info : "test"
      };
    },
  });
  /*
  var Todo = Backbone.Model.extend({
	
    // Default attributes for the todo item.
    defaults: function() {
      return {
        title: "empty todo...",
        order: Todos.nextOrder(),
        done: false,
		date: d
      };
    },

    // Toggle the `done` state of this todo item.
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });
*/
  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  /*
  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage("todos-backbone"),

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.where({done: true});
    },

    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.where({done: false});
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: 'order'

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;
*/
  // Todo Item View
  // --------------
	//var DayView = Backbone.View.extend({
	//	date: new Date(),
	//	color: "white",
	//	info:"",
	//	template: _.template($('#date-template').html()),
	//	render: function() {
	//	var currentDate = new Date();
	//	if(this.date.getMonth()!=currentDate.getMonth())
	//	{this.color = "black"}
	//  this.$el.addClass(this.color).html(this.template(this));
    //  return this;
    //},
	//});
	var CalendarView = Backbone.View.extend({
		monthIndex:0,
		month:"",
		tagName: "div",
		days: [],
		template: _.template($('#calendar-template').html()),
		events:{
			"click #previousMonth":"previousMonth",
			"click #nextMonth":"nextMonth"
		},
		updateMonth: function(){
			var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
			this.month = monthNames[this.monthIndex];
		},
		render: function() {
			this.updateMonth();
			this.fillDays();
			this.$el.html(this.template(this));
			return this;
		},
		previousMonth: function(){
			this.monthIndex--;
			this.render();
		},
		nextMonth: function(){
			this.monthIndex++;
			this.render();
		},
		fillDays: function(){
		var days = [];
	
	var selectedMonthIndex = this.monthIndex;
	
	  //first days, previous month
	  var dateStartMonth = new Date();
	  dateStartMonth.setMonth(selectedMonthIndex);
	  dateStartMonth.setDate(1);
	  var firstDay = dateStartMonth.getDay();
	if(firstDay == 0){
	firstDay = 7;
	}
	   for(i = 1; i < firstDay ; i++) {
	   var previousMonthDay = new Day();
	   previousMonthDay.date = new Date();
	   previousMonthDay.date.setMonth(selectedMonthIndex);
	   previousMonthDay.date.setDate(dateStartMonth.getDate()-i);
	   previousMonthDay.info = selectedMonthIndex;
	   days.unshift(previousMonthDay);
	}
	//current month
	var lastDay = new Date();
	lastDay.setMonth(selectedMonthIndex);
	  lastDay.setDate(31);
	var lastDayIndex = selectedMonthIndex == lastDay.getMonth() ? 31 : 30;
	lastDay.setMonth(selectedMonthIndex);
	lastDay.setDate(lastDayIndex);
	for(i = 1; i <= lastDayIndex; i++) {
	   var day = new Day();
	   day.date = new Date();
	   day.date.setDate(i)
	   day.date.setMonth(selectedMonthIndex);
	   day.info = i;
	   //blankDay.date.setDate(dateStartMonth.getDate()-i);
	  // var weekview = new WeekView();
	  // weekview.append(blankDay.render().el);
	  // this.calendar.append(weekview);
	  //last days
	   days.push(day);
	}
	//Last days, next month
	var lastDayWeekIndex = lastDay.getDay();
	if(lastDayWeekIndex!=0){
	for(i=1;i<=7-lastDayWeekIndex;i++){
		var nextMonthDay = new Day();
		nextMonthDay.date = new Date();
		nextMonthDay.date.setMonth(selectedMonthIndex);
		nextMonthDay.date.setDate(lastDayIndex+i);
		days.push(nextMonthDay);
	}
	}
	//add to view
	this.days = days;
		}
	});
//	var MonthSelectorView = Backbone.View.extend({
//		template: _.template($('#month-template').html()),
//		render: function(){
			
//		},
//	});
  // The DOM element for a todo item...
  /*
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click a.destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });
*/
  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#calendarapp"),

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template($('#stats-template').html()),
	infosTemplate: _.template($('#infos-template').html()),
    // Delegated events for creating new items, and clearing completed ones.
    /*
	events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },
*/
    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
/*
      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
//this.infos = this.$('#infos');
      this.main = $('#main');
//this.info = "test";
//this.info="first";
      Todos.fetch();
//this.test = this.$("#test");
*/
		this.calendar = this.$("#calendar");
		
	  this.fillCalendar();
    },
	fillCalendar : function() {
	var calendarView = new CalendarView();
	calendarView.monthIndex =(new Date()).getMonth();
	this.calendar.append(calendarView.render().el);
	
	},
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
	/*
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }
	//this.infos.html(this.infosTemplate(this));
      this.allCheckbox.checked = !remaining;
	  */
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
	/*
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }
*/
  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});

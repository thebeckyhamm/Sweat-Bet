(function(views) {

var Input = React.createClass({displayName: "Input",
    render: function() {
        var htmlID = "textinput-" + name + Math.random();
        var type = this.props.type || "text";
        var label = this.props.label || this.props.name;
        var placeholder = this.props.placeholder || "";
        var value = this.props.value || "";
        var required = this.props.required || "";
        return (
            React.createElement("div", {className: "field"}, 
                React.createElement("label", {htmlFor: htmlID}, label), 
                React.createElement("input", {
                    type: type, 
                    name: this.props.name, 
                    htmlID: htmlID, 
                    placeholder: placeholder, 
                    defaultValue: value, 
                    required: required}
                )
            )
        );
    }

});

var Select = React.createClass({displayName: "Select",

    makeOption: function(option, index) {   
        var data = option;
        //console.log(option);
        var value = option["_id"] || option;

        if (option["name"]) {
            var concatName = option["name"] + " " +  
                             option["number"] + " " +
                             option["unit"] + " " +
                             "per week";
        }
        var name = concatName || option;
        //console.log(name, value);
        return React.createElement("option", {key: index, value: value}, name);

    },

    render: function() {
        var htmlID = "select-" + name + Math.random();
        var label = this.props.label || this.props.name;

        return (
            React.createElement("div", {className: "field field-select"}, 
                React.createElement("label", {htmlFor: htmlID}, label), 
                React.createElement("select", {htmlID: htmlID, 
                        defaultValue: this.props.defaultValue, 
                        name: this.props.name}, 
                    _.map(this.props.options, this.makeOption)
                )
                
            )
        );
    }

});


views.Input = Input;
views.Select = Select;


})(app.views);

(function(views){

    views.EntryForm = React.createBackboneClass({

        onSubmit: function(e) {
            e.preventDefault();
            var entryItems = $(e.target).serializeJSON();
            var states = _.map(entryItems, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                app.trigger("create:entries:collection", entryItems);
            }
        },

        getInitialState: function() {
          return {
            start_date: null
          };
        },

        handleStartDateChange: function(date) {
            this.setState({
                start_date: date
            });
        },


        getGoalNames: function() {
            var collection = this.props.collection.toJSON();

            var userGoals = _.filter(collection, function(goal) {
                return app.currentUser.id === goal.user_id
            });
            return userGoals;

        },

        render: function() {
            return (
                React.createElement("div", {className: "main"}, 
                    React.createElement("form", {onSubmit: this.onSubmit, className: "form form-entry"}, 
                        React.createElement(views.Select, {label: "Goal", 
                            options: this.getGoalNames(), 
                            name: "goal_id"}), 
                        React.createElement(views.Input, {
                            label: "Completed (#)", 
                            type: "number", 
                            name: "number", 
                            placeholder: "5", 
                            required: "required"}), 
                        React.createElement("div", {className: "field"}, 
                        React.createElement("label", null, "Date Completed"), 
                        React.createElement(DatePicker, {
                            selected: this.state.start_date, 
                            onChange: this.handleStartDateChange, 
                            placeholderText: "Click to select a date", 
                            maxDate: moment(), 
                            weekStart: "0"})
                        ), 
                        React.createElement("div", {className: "text-right"}, 
                            React.createElement("button", {className: "button button-primary"}, "Add Entry")
                        )
                    )
                )
            );
        }

    });

})(app.views);
(function(views){

    views.TwitterLogin = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("button", {
                    className: "button", 
                    onClick: app.twitterLogin.bind(app)}, "Sign In / Up"
                )  
            );     
        }

    });


    views.TwitterLogout = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("button", {
                    className: "button", 
                    onClick: app.logout.bind(app)}, "Sign Out"
                )  
            )
        }
    });


    views.LogInOut = React.createBackboneClass({

        getCorrectButton: function() {
            if (this.props.model.id) {
                return React.createElement(views.TwitterLogout, null);
            }
            else {
                return React.createElement(views.TwitterLogin, null)
            }
        },

        render: function() {
            return (
               React.createElement("div", {className: "log-in-out"}, this.getCorrectButton())
            )
        }
    });



})(app.views);
(function(views){

    views.GoalForm = React.createBackboneClass({

        units: ["miles", "minutes", "reps", "lbs", "times", "days"],
        time: ["per day", "per week", "per month", "in total"],

        onSubmit: function(e) {
            e.preventDefault();
            var goalItems = $(e.target).serializeJSON();
            var states = _.map(goalItems, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                console.log(goalItems);
                app.trigger("create:goals:collection", goalItems);
            }
        },

        render: function() {
            return (
                React.createElement("div", {className: "main"}, 
                    React.createElement("form", {onSubmit: this.onSubmit, className: "form goal-form"}, 
                        React.createElement("h2", null, "Set up your weekly goal."), 
                        React.createElement(views.Input, {
                            label: "Goal Name", 
                            type: "text", 
                            name: "name", 
                            placeholder: "ex: Run", 
                            required: "required"}), 
                        React.createElement(views.Input, {
                            label: "Number", 
                            type: "number", 
                            name: "number", 
                            placeholder: "5", 
                            required: "required"}), 
                        React.createElement(views.Select, {label: "Unit (per week)", 
                            options: this.units, 
                            name: "unit", 
                            defaultValue: "days"}), 
                        React.createElement("div", {className: "text-right"}, React.createElement("button", {className: "button button-primary"}, "Add Goal"))
                        
                    )
                )

            );
        }

    });

})(app.views);
(function(views){

    views.CreateTeamForm = React.createClass({displayName: "CreateTeamForm",

        weeks: [8,9,10,11,12,13,14,15],

        onSubmit: function(e) {
            e.preventDefault();
            var teamOptions = $(e.target).serializeJSON();
            var states = _.map(teamOptions, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                app.trigger("add:team", teamOptions);   
            }
        },

        getInitialState: function() {
          return {
            start_date: null
          };
        },

        handleStartDateChange: function(date) {
            this.setState({
                start_date: date
            });
        },

        render: function() {
            return (
                React.createElement("div", {className: "main create-team clearfix"}, 
                    React.createElement("div", {className: "create-team-form"}, 
                        React.createElement("form", {onSubmit: this.onSubmit, className: "form"}, 
                            React.createElement("h2", null, "Create your team"), 
                            React.createElement(views.Input, {
                                label: "Team Name", 
                                type: "text", 
                                name: "name", 
                                placeholder: "ex: Eat My Dust", 
                                required: "required"}), 
                            React.createElement(views.Input, {
                                label: "Bet per Person (in $)", 
                                type: "number", 
                                name: "number", 
                                placeholder: "ex: 25.00", 
                                required: "required"}), 
                            React.createElement(views.Select, {
                                label: "Length of Competition (in weeks)", 
                                options: this.weeks, 
                                name: "weeks", 
                                defaultValue: "12"}), 
                            React.createElement("div", {className: "field"}, 
                                React.createElement("label", null, "Start Date"), 
                                React.createElement(DatePicker, {
                                    selected: this.state.start_date, 
                                    onChange: this.handleStartDateChange, 
                                    placeholderText: "Click to select a date", 
                                    weekStart: "0"})
                                ), 
                            React.createElement("div", {className: "text-right"}, React.createElement("button", {className: "button button-primary"}, "Create Team"))
                        )
                    ), 
                    React.createElement("div", {className: "create-team-sidebar"}, 
                        React.createElement("h4", null, "Need a team name?"), 
                        React.createElement("p", null, "Use ", React.createElement("a", {href: "http://www.wordlab.com/gen/team-name-generator.php"}, "this team name generator"), " for ideas."), 
                        React.createElement("br", null), 
                        React.createElement("h4", null, "How long should the competition be?"), 
                        React.createElement("p", null, "We recommend your competition be at least 12 weeks in order for people to actually see changes in their lifestyle/body/etc.")
                    )
                )

            );
        }

    });



})(app.views);
(function(views){

    views.Menu = React.createClass({displayName: "Menu",
        getInitialState: function() {
           return {
                activeMenu: ''
           };
         },

         setActiveMenu: function(e) {
             e.preventDefault();
             if (this.state.activeMenu !== "active") {
                 this.setState({activeMenu: "active"});
             }
             else {
                 this.setState({activeMenu: ""});
             }
         },

        goToGoals: function(e) {
            e.preventDefault();
            app.trigger("fetch:goals:collection");
            this.setState({activeMenu: ""});
        },

        goToTeamDashboard: function(e) {
            e.preventDefault();
            app.trigger("fetch:users:collection");
            this.setState({activeMenu: ""});
        },

        goToProfile: function(e) {
            e.preventDefault();
            app.trigger("show:profile");
            this.setState({activeMenu: ""});
        },

        goalButton: function(daysFromStart) {
            if (daysFromStart < 0) {
                return (
                    React.createElement("button", {
                        className: "button", 
                        onClick: this.props.addGoal}, "+ Goal"
                    )
                )
            }
            else {
                return;
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    React.createElement("button", {className: "button", 
                        onClick: this.props.addEntry}, "+ Entry"
                    )
                )
            }
        },

        componentDidMount: function() {

        },

        render: function() {
            var team = this.props.team;
            team = team.toJSON();

            var start_date = moment(team.datepicker);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var menuClass = "menu-wrapper " + this.state.activeMenu;

            return (
                React.createElement("div", {className: menuClass}, 

                React.createElement("div", {className: "main-menu"}, 
                    React.createElement("ul", null, 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#", onClick: this.goToTeamDashboard}, "Team Dashboard")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#", onClick: this.goToGoals}, "My Goals")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#", onClick: this.goToProfile}, "My Profile")
                        ), 
                        React.createElement("li", {className: "entry-lg"}, 
                            this.goalButton(daysFromStart), 
                            this.entryButton(daysFromStart)
                        )

                    )
                )
                )

            )
        }

    });

    views.Header = React.createClass({displayName: "Header", 
        // setActiveMenu: function() {
        //     alert("yup");
        // },

        showMenuButton: function() {
            if (!_.isEmpty( app.currentUser.attributes )) {
              return React.createElement("div", {className: "button button-menu", onClick: this.setActiveMenu}, "Menu")
            }
            else {
                return;
            }
        },

        render: function() {

            return (
                React.createElement("div", {className: "header-wrapper"}, 
                    React.createElement("div", {className: "header-bar"}, 
                        this.showMenuButton(), 
                        React.createElement("h1", {className: "logo"}, "SweatBet"), 
                        React.createElement("div", {className: "header-admin"}, 
                            React.createElement(views.LogInOut, {model: this.props.model})
                        )
                    )
                )

            )
        }

    });

})(app.views);
(function(views){

    views.JoinTeam = React.createBackboneClass({
        selectTeam: function(model) {
            this.props.onTeamSelect(model);            
        },

        getTeam: function(model, index) {
            return (
                React.createElement("li", {key: index}, React.createElement("button", {className: "button button-primary", onClick: this.selectTeam.bind(this, model)}, model.get("name")))
            );
        },

        render: function() {
            if (this.props.collection.length === 0) {
                return (
                    React.createElement("div", {className: "main"}, 
                        React.createElement("div", {className: "join-team"}, 

                            React.createElement("h2", null, "We're fresh out of teams."), 
                            React.createElement("button", {className: "button button-primary", onClick: this.props.onCreateNew}, "Create your own.")
                        )
                    )

                );
            }

            return (
                React.createElement("div", {className: "main"}, 
                    React.createElement("div", {className: "join-team"}, 
                        React.createElement("h4", null, "Choose the team you'd like to join."), 
                        React.createElement("ul", {className: "list list-buttons"}, this.props.collection.map(this.getTeam))
                    )
                )
            );
        }

    });



})(app.views);
(function(views){

    views.LandingPage = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("section", {className: "main"}, 
                    React.createElement("article", {className: "landing-page"}, 
                        React.createElement("h2", null, "Beat your friends."), 
                        React.createElement("h2", null, "Get in shape."), 
                        React.createElement("h2", null, "Win $$."), 
                        React.createElement("img", {src: "images/svg/flexions.svg"})
                    )
                ) 
            );
        }

    });



})(app.views);
(function(views){

    var AddYourGoals = React.createClass({displayName: "AddYourGoals",
        render: function() {
            return (
            React.createElement("div", null, 
                React.createElement("br", null), 
                React.createElement("h1", {className: "text-center"}, 
                    "You don't have any goals yet.", 
                    React.createElement("br", null), 
                    "Add some goals!"
                )
            )
            );
        }

    });

    var UserProgress = React.createBackboneClass({

        getCurrentTotal: function(user) {
            // get total current completed units
            var entriesSummed = _.map(user.goals, function(g) {
                return g.entries_sum;
            });

            entriesSummed = _.filter(entriesSummed, function(g) {
                return g;
            });

            var currentTotal = _.reduce(entriesSummed, function(a, b) {
                return a + b;
            });

            if (currentTotal === undefined) {
                currentTotal = 0;
            }

            return currentTotal;

        },

        getCompetitionTotal: function(user) {

            var goals = _.map(user.goals, function(g) {
                return parseInt(g.number);
            });
            var goalsTotal = _.reduce(goals, function(a, b) {
                return a + b;
            });
            return goalsTotal * this.props.team.weeks;

        },

        getPercentComplete: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(1);
            return percentComplete + "%";
        },

        getCorrectPage: function(goalsCount, user) {

        },

        render: function() {
            var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
            var user = this.props.model.toJSON();

            // use in parentheses beside user name
            var goalsCount = user.goals.length;

            var competitionTotal = this.getCompetitionTotal(user);

            var currentTotal = this.getCurrentTotal(user);

            var percentComplete = this.getPercentComplete(currentTotal, competitionTotal);

            if (percentComplete === "NaN%") {
                percentComplete = "0%";
            }

            var getCorrect = this.getCorrectPage(goalsCount, user);

            var weeksComplete = this.getPercentComplete(this.props.week, this.props.team.weeks);

            var percentStyle = {
                width: percentComplete
            };

            var weeksStyle = {
                marginLeft: weeksComplete
            };

            var currentUser = app.currentUser.get("_id");
            if (goalsCount === 0 && (currentUser === user._id)) {
                return React.createElement(AddYourGoals, null);
            }

            else {
                return (
                  React.createElement("div", {className: "goal-progress"}, 
                        React.createElement("h3", {className: "goal-name"}, user.name, " (", goalsCount, " goals)"), 
                        React.createElement("div", {className: "progress-container", "data-percent": percentComplete}, 
                                React.createElement("div", {className: "progress-bar", style: percentStyle}), 
                          
                            React.createElement("div", {className: "progress-week", style: weeksStyle})
                      )
                  )  
                );

            }
        }

    });

    var DataPane = React.createBackboneClass({

        getUserProgress: function(team, currentWeek, model, index) {
            return React.createElement(UserProgress, {
                    model: model, 
                    key: index, 
                    team: team, 
                    week: currentWeek})
        },

        render: function() {

            return (
                React.createElement("article", {className: "all-goals"}, 
                    React.createElement("div", null, this.props.collection.map(this.getUserProgress.bind(this, this.props.team, this.props.currentWeek))), 
                    React.createElement("div", {className: "image"}, React.createElement("img", {src: "images/svg/cape1.svg"}))

                )
            );
            
        }

    });


    views.MainDash = React.createBackboneClass({

        goalButton: function(daysFromStart) {
            if (daysFromStart <= 0) {
                return (
                    React.createElement("button", {
                        className: "button button-primary", 
                        onClick: this.props.addGoal}, "+ Goal"
                    )
                )
            }
            else {
                return;
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    React.createElement("button", {className: "button button-primary", 
                        onClick: this.props.addEntry}, "+ Entry"
                    )
                )
            }
        },

        render: function() {
            var team = this.props.getTeam();
            team = team.toJSON();

            var start_date = moment(team.datepicker);
            var now = moment();

            var end_date = moment(team.start_date).add((team.weeks * 7), "days").calendar();

            var daysFromStart = now.diff(start_date, 'days');

            var currentWeek = Math.ceil(daysFromStart / 7);

            if (currentWeek === 0) {
                currentWeek = "Competition starts " + start_date.fromNow(); 
            }
            var totalPot = team.number * this.props.collection.length;

            var profile = app.currentUser.get("twitter_profile");

            return (
                React.createElement("section", null, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, "Team Dashboard")
                    ), 
                    React.createElement("div", {className: "flex dashboard main"}, 
                        React.createElement("div", {className: "header-meta order-1"}, 
                            React.createElement("div", {className: "team-data"}, 
                                React.createElement("div", {className: "greeting"}, 
                                    React.createElement("span", {className: "greeting-name"}, "Howdy,", React.createElement("br", null), " ", app.currentUser.get("name"), "!"), 
                                    React.createElement("img", {src: profile.profile_image_url})
                                ), 
                                React.createElement("div", {className: "week"}, 
                                    React.createElement("span", {className: "label"}, "Week:"), 
                                    React.createElement("span", null, currentWeek)
                                ), 
                                React.createElement("div", {className: "team-name"}, 
                                    React.createElement("span", {className: "label"}, "Team Name:"), 
                                    React.createElement("span", null, team.name)
                                ), 
                                React.createElement("div", {className: "pot"}, 
                                    React.createElement("span", {className: "label"}, "Total Pot:"), 
                                    React.createElement("span", null, "$", totalPot)
                                )
                            ), 

                            React.createElement("div", {className: "button-toggle-sm"}, 
                                this.goalButton(daysFromStart), 
                                this.entryButton(daysFromStart)
                            )
                        ), 
                        React.createElement(DataPane, {collection: this.props.collection, team: team, currentWeek: currentWeek})


                    )
                )
            );
        }

    });



})(app.views);
(function(views){
    var SingleGoalProgress = React.createBackboneClass({
        // getGoalDetail: function(goal_id, e) {
        //     e.preventDefault();
        //     app.trigger("get:goal:detail", goal_id);

        // },

        getCurrentTotal: function(entries) {
            var entryNumbers = [];
            _.each(entries, function(obj) {
                entryNumbers.push(parseInt(obj.number));
            });
            return _.reduce(entryNumbers, function(a, b) {
                return a + b;
            });
        },

        getPercentComplete: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(1);
            return percentComplete + "%";
        },

        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            // get the end of the competition number
            var totalGoal = goal.number * this.props.team.weeks;

            // if the entries object is empty
            if (_.isEmpty(entries)) {
                var currentProgress = 0;
                var percentComplete = "0%";
                var progressStyle = {
                    width: percentComplete 
                }    
            }
            else {
                var currentProgress = this.getCurrentTotal(entries);
                var percentComplete = this.getPercentComplete(currentProgress, totalGoal);
                var progressStyle = {
                    width: percentComplete 
                }  
            }

            // calculate the marker for how far along we are in the competition
            var totalWeeks = this.props.team.weeks;
            var weeksComplete = this.getPercentComplete(this.props.week, totalWeeks);

            var goalName = goal.name + " " + 
                       goal.number + " " + 
                       goal.unit + " " + 
                       "per week";

            var weekLine = {
                marginLeft: weeksComplete 
            }
            return (
                React.createElement("div", {className: "goal-progress", key: this.props.key}, 
                    React.createElement("h4", null, goalName), 
                    React.createElement("div", {className: "progress-container", "data-percent": percentComplete}, 
                        React.createElement("div", {className: "progress-bar", style: progressStyle}), 
                        React.createElement("div", {className: "progress-week", style: weekLine})

                    ), 
                    React.createElement("span", {className: "goal-info"}, currentProgress, " ", goal.unit, " completed out of ", totalGoal, " ")
                )
            );
        }

    });


var TotalProgress = React.createBackboneClass({

    getCurrentTotal: function(existingEntries) {
        var entryNumbers = [];
        entryNumbers = _.flatten(existingEntries);

        entryNumbers = _.map(entryNumbers, function(obj) {
            return parseInt(obj.number);
        });

        return _.reduce(entryNumbers, function(a, b) {
            return a + b;
        });

    },

    getTotal: function(goals) {

        var goalNumbers = _.map(goals, function(goal) {
            return parseInt(goal.number);
        });

        var total = _.reduce(goalNumbers, function(a, b) {
            return a + b;
        });

        return total;

    },

    getPercentComplete: function(progress, end) {
        var percentComplete = ((progress / end) * 100).toFixed(1);

        return percentComplete + "%";

    },

    addMessage: function(weeksComplete, percentComplete) {
        var weeks = weeksComplete.slice(0, weeksComplete.length-1);
        var percent = percentComplete.slice(0, percentComplete.length-1);

        var diff = percent - weeks;

        if (diff < -15) {

            var msgs = [
                "Did you forget to add some entries?",
                "Sleep in again?",
                "Get back in that saddle!",
                "Money is no object, right?",
                ""

            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return React.createElement("h4", {className: "progress-message"}, React.createElement("span", null, msg));
            }


        }

        else if (diff < -5 ) {

            var msgs = [
                "Getting behind! Step it up!",
                "Sweating yet?",
                ""
            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return React.createElement("h4", {className: "progress-message"}, React.createElement("span", null, msg));
            }
        }

        if (diff > 5) {
            var msgs = [
                "Kickin' butt and takin' names!",
                "Get it!",
                "Show me the money",
                "",
                ""

            ]
            var rand = Math.floor(Math.random() * (3 - 0));
            var msg = msgs[rand];

            if (!(msg === "")) {
                return React.createElement("h4", {className: "progress-message"}, React.createElement("span", null, msg));
            }

        }
    },

    render: function() {
        var goals = this.props.collection.toJSON();


        var entries = goals.map(function(goal) {
            return goal.entries;
        });

        var existingEntries = _.filter(entries, function(entry) {
            return !_.isEmpty(entry);
        });

        var totalGoals = this.getTotal(goals);
        var totalWeeks = this.props.team.weeks;

        var endAmount = totalGoals * totalWeeks;
        var weeksComplete = this.getPercentComplete(this.props.week, totalWeeks);


        if (_.isEmpty(existingEntries)) {
          var currentProgress = 0;
          var percentComplete = "0%";
          var progressStyle = {
              width: percentComplete 
          }    
        }
        else {
            var currentProgress = this.getCurrentTotal(existingEntries);
            var percentComplete = this.getPercentComplete(currentProgress, endAmount);
            var progressStyle = {
                width: percentComplete 
            }  
        }

        var weekLine = {
            marginLeft: weeksComplete 
        }

        var message = this.addMessage(weeksComplete, percentComplete);


        return (

            React.createElement("div", {className: "goal-progress"}, 
                message, 
                React.createElement("h3", null, "Total Progress"), 
                React.createElement("div", {className: "progress-container", "data-percent": percentComplete}, 
                    React.createElement("div", {className: "progress-bar", style: progressStyle}), 
                    React.createElement("div", {className: "progress-week", style: weekLine})
                )
            )
        );
    }

});

    views.MyDash = React.createBackboneClass({

        getGoal: function(team, currentWeek, model, index) {
            return React.createElement(SingleGoalProgress, {
                    key: index, 
                    model: model, 
                    team: team, 
                    week: currentWeek});
        },

        getTotal: function(team, currentWeek) {
            return React.createElement(TotalProgress, {
                    collection: this.props.collection, 
                    team: team, 
                    week: currentWeek})
        },

        goalButton: function(daysFromStart) {
            if (daysFromStart < 0) {
                return (
                    React.createElement("button", {
                        className: "button button-primary", 
                        onClick: this.props.addGoal}, "+ Goal"
                    )
                )
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    React.createElement("button", {className: "button button-primary", 
                        onClick: this.props.addEntry}, "+ Entry"
                    )
                )
            }
        },

        render: function() {
            var team = this.props.getTeam();
            team = team.toJSON();

            var start_date = moment(team.datepicker);
            var now = moment();

            var daysFromStart = now.diff(start_date, 'days');

            var currentWeek = Math.ceil(daysFromStart / 7);
            if (currentWeek === 0) {
                currentWeek = "Competition starts " + start_date.fromNow(); 
            }


            var profile = app.currentUser.get("twitter_profile");


            return (
                React.createElement("section", null, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, "My Goals")
                    ), 
                    React.createElement("div", {className: "flex dashboard main"}, 
                        React.createElement("div", {className: "header-meta order-1"}, 
                            React.createElement("div", {className: "team-data"}, 
                                React.createElement("div", {className: "greeting"}, 
                                    React.createElement("span", {className: "greeting-name"}, "Howdy,", React.createElement("br", null), " ", app.currentUser.get("name"), "!"), 
                                    React.createElement("br", null), 
                                    React.createElement("img", {src: profile.profile_image_url})
                                ), 

                                React.createElement("div", {className: "week"}, 
                                    React.createElement("span", {className: "label"}, "Week:"), 
                                    React.createElement("span", null, currentWeek)
                                ), 
                                React.createElement("div", {className: "team-name"}, 
                                    React.createElement("span", {className: "label"}, "Team Name:"), 
                                    React.createElement("span", null, team.name)
                                )
                            ), 

                            React.createElement("div", {className: "button-toggle-sm"}, 
                                this.goalButton(daysFromStart), 
                                this.entryButton(daysFromStart)
                            )

                        ), 
                        React.createElement("article", {className: "all-goals"}, 
                            React.createElement("div", null, this.getTotal(team, currentWeek)), 
                            React.createElement("hr", null), 
                            React.createElement("h3", null, "Individual Goals"), 
                            React.createElement("div", null, this.props.collection.map(this.getGoal.bind(this, team, currentWeek)))
                        )

                    )
                )
            );
        }

    });



})(app.views);
(function(views){

    views.MyProfile = React.createBackboneClass({

        render: function() {
            var profile = this.props.model.get("twitter_profile");
            console.log(profile);
            return (
                React.createElement("section", null, 
                    React.createElement("header", {className: "header-main"}, 
                        React.createElement("h2", null, "My Profile")
                    ), 
                    React.createElement("div", {className: "main"}, 

                        React.createElement("div", {className: "profile"}, 
                            React.createElement("span", {className: "label"}, "Name:"), 
                            React.createElement("span", null, this.props.model.get("name")), 
                            React.createElement("br", null), 
                            React.createElement("span", {className: "label"}, "Photo:"), 
                            React.createElement("span", null, React.createElement("img", {src: profile.profile_image_url}))
                        )
                    )
                )
            );
        }
    });



})(app.views);
(function(views){

    views.JoinOrCreateTeam = React.createBackboneClass({

        render: function() {
            return (
                React.createElement("div", {className: "main"}, 
                    React.createElement("div", {className: "onboarding"}, 
                        React.createElement("h2", null, "Hi, ", this.props.model.get("name"), "! ", React.createElement("br", null), "Welcome to SweatBet!"), 
                        React.createElement("br", null), 
                        React.createElement("div", {className: "buttons-toggle"}, 
                            React.createElement("button", {className: "button button-primary button-lg", onClick: this.props.onJoinSelect}, "Join a Team"), 
                            React.createElement("button", {className: "button button-primary button-lg", onClick: this.props.onCreateNew}, "Create New Team ")
                        )
                    )
                )
  
            );
        }

    });



})(app.views);
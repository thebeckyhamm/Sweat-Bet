(function(views){

    var AddYourEntries = React.createClass({
        render: function() {
            return (
            <div>
                <br /> 
                <h1 className="text-center">
                    You don't have any entries yet.
                    <br/> 
                    Add some entries!
                </h1>
            </div>
            );
        }

    });

    var AddYourGoals = React.createClass({
        render: function() {
            return (
            <div>
                <br /> 
                <h1 className="text-center">
                    You don't have any goals yet.
                    <br/> 
                    Add some goals!
                </h1>
            </div>
            );
        }

    });

    var CompetitionStartingSoon = React.createClass({
        render: function() {
            return (
            <div>
                <br /> 
                <h1 className="text-center">
                    The competition starts soon!
                </h1>
                <h2 className="text-center">
                    Make sure you've entered all your goals.
                </h2>
            </div>
            );
        }

    });

    var DeleteButton = React.createClass({

        render: function() {
            return <span className="button-delete" onClick={this.props.onDeleteClick}>x</span>;
        }
    });

    var SingleGoalProgress = React.createBackboneClass({

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

        getDeleteButton: function(mins) {
            if (mins < 0) {
                return <DeleteButton onDeleteClick={this.onDeleteClick} />;
            }
        },

        onDeleteClick: function() {
            var goal = this.props.model.toJSON();
            app.trigger("remove:goal", goal._id);
        },

        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            // get the end of competition number
            var totalGoal = goal.number * this.props.team.weeks;

            // if the entries object is empty
            if (_.isEmpty(entries)) {
                var userProgress = 0;
                var userPercentComplete = "0%";
  
            }
            else {
                var userProgress = this.getCurrentTotal(entries);
                var userPercentComplete = this.getPercentComplete(userProgress, totalGoal);
            }

            // construct the full goal name
            var goalName = goal.name + " " + 
                       goal.number + " " + 
                       goal.unit + " " + 
                       "per week";

            // style the progress bars
            var progressStyle = {
                width: userPercentComplete 
            }  
            var weeksStyle = {
                marginLeft: this.props.completion
            }


            return (
                <div className="goal-progress" key={this.props.key}>
                    <h4>{goalName}</h4>
                    <div className="progress-container" data-percent={userPercentComplete}>
                        <span>{this.getDeleteButton(this.props.mins)}</span>
                        <div className="progress-bar" style={progressStyle} />
                        <div className="progress-week" style={weeksStyle} />

                    </div>
                    <span className="goal-info">{userProgress} {goal.unit} completed out of {totalGoal} </span>
                </div>
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
        // get all goal numbers
        var goalNumbers = _.map(goals, function(goal) {
            return parseInt(goal.number);
        });
        // sum them together
        var total = _.reduce(goalNumbers, function(a, b) {
            return a + b;
        });

        return total;

    },

    getPercentComplete: function(progress, end) {
        var percentComplete = ((progress / end) * 100).toFixed(1);

        return percentComplete + "%";

    },

    addMessage: function(compComplete, userComplete) {
        var comp = compComplete.slice(0, compComplete.length-1);
        var user = userComplete.slice(0, userComplete.length-1);

        var diff = user - comp;

        if (diff < -15) {

            var msgs = [
                "Did you forget to add some entries?",
                "Did you sleep in again?",
                "Get back in that saddle!",
                "Money is no object, right?",
                ""
            ]
        }
        else if (diff < -5 ) {

            var msgs = [
                "Getting behind! Step it up!",
                "Sweating yet?",
                ""
            ]
        }
        else if (diff > 5) {
            var msgs = [
                "Kickin' butt and takin' names!",
                "Get it!",
                "Show me the money!",
                "",
                ""
            ]
        }
        else {
            return;
        }

        var rand = Math.floor(Math.random() * (3 - 0));
        var msg = msgs[rand];

        if (!(msg === "")) {
            return <h4 className="progress-message"><span>{msg}</span></h4>;
        }
    },

    render: function() {
        var goals = this.props.collection.toJSON();

        // get existing entries
        var entries = goals.map(function(goal) {
            return goal.entries;
        });
        var existingEntries = _.filter(entries, function(entry) {
            return !_.isEmpty(entry);
        });

        // get goal totals
        var endGoals = this.getTotal(goals) * this.props.team.weeks;
        // get total progress
        if (_.isEmpty(existingEntries)) {
          var userProgress = 0;
          var userPercentComplete = "0%";
        }
        else {
            var userProgress = this.getCurrentTotal(existingEntries);
            var userPercentComplete = this.getPercentComplete(userProgress, endGoals);
        }

        // set progress bar styles
        var progressStyle = {
            width: userPercentComplete 
        }  
        var weeksStyle = {
            marginLeft: this.props.completion 
        }

        var message = this.addMessage(this.props.completion, userPercentComplete);

        if (this.getTotal(goals) === undefined) {
            return <AddYourGoals />;
        }
        if (userPercentComplete === "0%" && (this.props.mins < 0)) {
            return <CompetitionStartingSoon />; 
        }

        if (userPercentComplete === "0%" && (this.props.mins >= 0)) {
            return <AddYourEntries />; 
        }


        return (

            <div className="goal-progress">
                {message}
                <h3>Total Progress</h3>
                <div className="progress-container" data-percent={userPercentComplete}>
                    <div className="progress-bar" style={progressStyle} />
                    <div className="progress-week" style={weeksStyle} />
                </div>
            </div>
        );
    }

});

    views.MyDash = React.createBackboneClass({

        getGoal: function(team, currentWeek, minsFromStart, competitionCompletion, model, index) {
            return <SingleGoalProgress 
                    key={index} 
                    model={model} 
                    team={team}
                    week={currentWeek}
                    mins={minsFromStart}
                    completion={competitionCompletion} />;
        },

        getTotal: function(team, minsFromStart, competitionCompletion) {
            return <TotalProgress 
                    collection={this.props.collection} 
                    team={team} 
                    mins={minsFromStart}
                    completion={competitionCompletion} />
        },

        getCompletionPercent: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(3);
            if (percentComplete < 0) {
                percentComplete = 0;
            }
            return percentComplete + "%";
        },

        getCurrentWeek: function(daysFromStart, minsFromStart, startDate) {
            var currentWeek;

            if (minsFromStart < 0) {
                currentWeek = "Competition starts " + startDate.fromNow(); 
            }
            else if (minsFromStart >=0 && minsFromStart < 1440) {
                currentWeek = 1;
            }
            else {
                currentWeek = Math.ceil(daysFromStart / 7);

            }
            
            return currentWeek;
        },

        buttonToggle: function(minsFromStart) {
            if (minsFromStart < 0) {
                return (
                    <button 
                        className="button button-primary"
                        onClick={this.props.addGoal}>+ Goal
                    </button>
                )
            }
            else if (minsFromStart >= 0) {
                return (
                    <button className="button button-primary"
                        onClick={this.props.addEntry}>+ Entry
                    </button>
                )
            }
        },

        render: function() {
            var team = this.props.model;

            if (!team) {
                return (
                    <h1 className="text-center loading">
                        <img src="images/svg/dumbbell.svg" />
                    Loading...
                    </h1>
                );
            }

            team = team.toJSON();

            // get dates and progress for days and weeks
            var startDate = moment(team.datepicker);
            var now = moment();

            var totalDays = team.weeks * 7;
            var daysFromStart = now.diff(startDate, 'days'); 
            var minsFromStart = now.diff(startDate, 'minutes');

            var competitionCompletion = this.getCompletionPercent(daysFromStart, totalDays);

            var currentWeek = this.getCurrentWeek(daysFromStart, minsFromStart, startDate);

            // get additional user information to display
            var profile = app.currentUser.get("twitter_profile");

            return (
                <section>
                    <header className="header-main">
                        <h2>My Goals</h2>
                    </header>
                    <div className="flex dashboard main">
                        <div className="header-meta order-1">
                            <div className="team-data">
                                <div className="greeting">
                                    <span className="greeting-name">Howdy,<br /> {app.currentUser.get("name")}!</span>
                                    <br />
                                    <img src={profile.profile_image_url} />
                                </div>

                                <div className="week">
                                    <span className="label">Week:</span>
                                    <span>{currentWeek}</span>
                                </div>
                                <div className="team-name">
                                    <span className="label">Team Name:</span>
                                    <span>{team.name}</span>
                                </div>
                            </div>

                            <div className="button-toggle-sm">  
                                {this.buttonToggle(minsFromStart)}
                            </div>

                        </div>
                        <article className="all-goals">
                            <div>{this.getTotal(team, minsFromStart, competitionCompletion)}</div>
                            <hr />
                            <h3>Individual Goals</h3>
                            <div>{this.props.collection.map(
                                    this.getGoal.bind(
                                        this, 
                                        team, 
                                        currentWeek,
                                        minsFromStart,
                                        competitionCompletion 
                                    )
                                )}
                            </div>
                        </article>

                    </div>
                </section>
            );
        }

    });



})(app.views);
(function(views){

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

    var UserProgress = React.createBackboneClass({

        getCurrentTotal: function(user) {
            // get total current completed units
            var entriesSummed = _.map(user.goals, function(g) {
                return g.entries_sum;
            });

            // get non-empty values
            entriesSummed = _.filter(entriesSummed, function(g) {
                return g;
            });

            // sum values together
            var currentTotal = _.reduce(entriesSummed, function(a, b) {
                return a + b;
            });

            // validation check
            if (currentTotal === undefined) {
                currentTotal = 0;
            }

            return currentTotal;

        },

        getCompetitionTotal: function(user) {
            // return number value for each goal (ie 10 miles, 2 lbs)
            var goals = _.map(user.goals, function(g) {
                return parseInt(g.number);
            });

            // sum them together
            var goalsTotal = _.reduce(goals, function(a, b) {
                return a + b;
            });

            // multiply by number of weeks
            return goalsTotal * this.props.team.weeks;

        },

        getPercentComplete: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(1);
            percentComplete = percentComplete + "%";

            if (percentComplete === "NaN%") {
                percentComplete = "0%";
            }

            return percentComplete;
        },

        render: function() {
            var user = this.props.model.toJSON();

            // get totals for user
            var goalsCount = user.goals.length;
            console.log("goalscount", goalsCount);
            var competitionTotal = this.getCompetitionTotal(user);
            var currentTotal = this.getCurrentTotal(user);

            // get percent complete
            var percentComplete = this.getPercentComplete(currentTotal, competitionTotal);

            // set styles for progress bars
            var percentStyle = {
                width: percentComplete
            };

            var weeksStyle = {
                marginLeft: this.props.completion
            };

            var currentUser = app.currentUser.get("_id");

            // if you are the current user and have no goals
            if (goalsCount === 0 && (currentUser === user._id)) {
                return <AddYourGoals />;
            }

            else {
                return (
                  <div className="goal-progress">
                        <h3 className="goal-name">{user.name} ({goalsCount} goals)</h3>
                        <div className="progress-container" data-percent={percentComplete}>
                            <div className="progress-bar" style={percentStyle} />
                            <div className="progress-week" style={weeksStyle}  />
                      </div>
                  </div>  
                );

            }
        }

    });


    views.MainDash = React.createBackboneClass({

        getUserProgress: function(team, competitionCompletion, model, index) {
            return <UserProgress 
                    model={model} 
                    key={index}
                    team={team} 
                    completion={competitionCompletion} />
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

        getCompletionPercent: function(progress, end) {
            var percentComplete = ((progress / end) * 100).toFixed(1);
            if (percentComplete < 0) {
                percentComplete = 0;
            }

            return percentComplete + "%";
        },

        getCurrentWeek: function(daysFromStart, startDate) {
            var currentWeek = Math.ceil(daysFromStart / 7);

            // account for days before competition begins
            if (currentWeek <= 0) {
                currentWeek = "Competition starts " + startDate.fromNow(); 
            }
            return currentWeek;
        },

        render: function() {
            var team = this.props.model;
            var collection = this.props.collection;
            console.log(collection);
            if (!team || !collection.length) {
                return (
                    <h1 className="text-center loading">
                        <img className="" src="images/svg/dumbbell.svg" />
                    Loading...
                    </h1>
                );
            }

            team = team.toJSON();

            // calculate current and total days and weeks
            var startDate = moment(team.datepicker);
            var now = moment();

            var endDate = moment(team.startDate).add((team.weeks * 7), "days").calendar();

            var totalDays = team.weeks * 7;
            var daysFromStart = now.diff(startDate, 'days');
            var minsFromStart = now.diff(startDate, 'minutes');

            var competitionCompletion = this.getCompletionPercent(daysFromStart, totalDays);
            var currentWeek = this.getCurrentWeek(daysFromStart, startDate);

            // User and team data to display
            var totalPot = team.number * this.props.collection.length;

            var profile = app.currentUser.get("twitter_profile");

            return (
                <section>
                    <header className="header-main">
                        <h2>Team Dashboard</h2>
                    </header>
                    <div className="flex dashboard main">
                        <div className="header-meta order-1">
                            <div className="team-data">
                                <div className="greeting">
                                    <span className="greeting-name">Howdy,<br /> {app.currentUser.get("name")}!</span>
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
                                <div className="pot">
                                    <span className="label">Total Pot:</span>
                                    <span>${totalPot}</span>
                                </div>
                            </div>

                            <div className="button-toggle-sm">  
                                {this.buttonToggle(minsFromStart)}
                            </div>
                        </div>
                        <article className="all-goals">
                            <div>{this.props.collection.map(
                                    this.getUserProgress.bind(
                                        this, 
                                        team, 
                                        competitionCompletion
                                    )
                                )}
                            </div>
                            <div className="image"><img src="images/svg/cape1.svg" /></div>
                        </article>


                    </div>
                </section>
            );
        }

    });



})(app.views);
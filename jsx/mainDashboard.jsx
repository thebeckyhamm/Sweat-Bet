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

    var DataPane = React.createBackboneClass({

        getUserProgress: function(team, currentWeek, model, index) {
            return <UserProgress 
                    model={model} 
                    key={index}
                    team={team} 
                    week={currentWeek} />
        },

        render: function() {

            return (
                <article className="all-goals">
                    <div>{this.props.collection.map(this.getUserProgress.bind(this, this.props.team, this.props.currentWeek))}</div>
                </article>
            );
            
        }

    });


    views.MainDash = React.createBackboneClass({

        goalButton: function(daysFromStart) {
            if (daysFromStart <= 0) {
                return (
                    <button 
                        className="button button-primary"
                        onClick={this.props.addGoal}>+ Goal
                    </button>
                )
            }
            else {
                return;
            }
        },

        entryButton: function(daysFromStart) {
            if (daysFromStart >= 0) {
                return (
                    <button className="button button-primary"
                        onClick={this.props.addEntry}>+ Entry
                    </button>
                )
            }
        },

        render: function() {
            var team = this.props.getTeam();
            team = team.toJSON();

            var start_date = moment(team.start_date);
            var now = moment();

            var end_date = moment(team.start_date).add((team.weeks * 7), "days").calendar();

            var daysFromStart = now.diff(start_date, 'days');

            var currentWeek = Math.ceil(daysFromStart / 7);
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
                                {this.goalButton(daysFromStart)}
                                {this.entryButton(daysFromStart)}
                            </div>
                        </div>
                        <DataPane collection={this.props.collection} team={team} currentWeek={currentWeek} />

                    </div>
                </section>
            );
        }

    });



})(app.views);
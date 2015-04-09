(function(views){

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

        render: function() {
            var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
            var user = this.props.model.toJSON();

            // use in parentheses beside user name
            var goalsCount = user.goals.length;

            var competitionTotal = this.getCompetitionTotal(user);

            var currentTotal = this.getCurrentTotal(user);

            var percentComplete = this.getPercentComplete(currentTotal, competitionTotal);


            var weeksComplete = this.getPercentComplete(this.props.week, this.props.team.weeks);

            var percentStyle = {
                width: percentComplete
            };

            var weeksStyle = {
                marginLeft: weeksComplete
            };


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

    });

    views.MainDash = React.createBackboneClass({

        getUserProgress: function(team, currentWeek, model, index) {
            return <UserProgress 
                    model={model} 
                    key={index}
                    team={team} 
                    week={currentWeek} />
        },

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

            return (
                <section className="main">
                    <header className="header-main">
                        <h2>Week {currentWeek}</h2>
                        <div className="header-meta">
                            <div>
                                <div>{team.name}</div>
                                <div>Total Pot: ${totalPot}</div>
                            </div>

                            <div>
                                {this.goalButton(daysFromStart)}
                                {this.entryButton(daysFromStart)}
                            </div>
                        </div>
                       
                    </header>
                    <article className="all-goals">
                        <div>{this.props.collection.map(this.getUserProgress.bind(this, team, currentWeek))}</div>


                    </article>
                </section>
            );
        }

    });



})(app.views);
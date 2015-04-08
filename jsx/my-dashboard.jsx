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

        getPercentComplete: function(currentProgress, totalGoal) {
            var percentComplete = ((currentProgress / totalGoal) * 100).toFixed(1);
            return percentComplete + "%";
        },

        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            var totalGoal = goal.number * this.props.weeks;
            var currentProgress = this.getCurrentTotal(entries);

            var percentComplete = this.getPercentComplete(currentProgress, totalGoal);

            var goalName = goal.name + " " + 
                       goal.number + " " + 
                       goal.unit + " " + 
                       goal.amountOfTime;
            var progressStyle = {
                width: percentComplete 
            }
            return (
                <div className="goal-progress" key={this.props.key}>
                    <h4>{goalName} - {percentComplete}</h4>
                    <div className="progress-container">
                        <div className="progress-bar" style={progressStyle} />
                    </div>
                    <span>{currentProgress} {goal.unit} out of {totalGoal} </span>
                </div>
            );
        }

    });


var TotalProgress = React.createBackboneClass({

    getCurrentTotal: function(entries) {
        var entryNumbers = [];
        entryNumbers = _.flatten(entries);

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

        return _.reduce(goalNumbers, function(a, b) {
            return a + b;
        });

    },

    getPercentComplete: function(currentProgress, endAmount) {
        var percentComplete = ((currentProgress / endAmount) * 100).toFixed(1);
        return percentComplete + "%";
    },

    render: function() {
        var goals = this.props.collection.toJSON();

        var entries = goals.map(function(goal) {
            return goal.entries;
        });


        var currentProgress = this.getCurrentTotal(entries);

        var totalGoals = this.getTotal(goals);

        console.log("weeks", this.props.weeks);
        var endAmount = totalGoals * this.props.weeks;

        var percentComplete = this.getPercentComplete(currentProgress, endAmount);

        var progressStyle = {
            width: percentComplete 
        }
        return (
            <div className="goal-progress">
                <h3>Total Progress: {percentComplete}</h3>
                <div className="progress-container">
                    <div className="progress-bar" style={progressStyle} />
                </div>
            </div>
        );
    }

});

    views.MyDash = React.createBackboneClass({

        getGoal: function(weeks, model, index) {
            return <SingleGoalProgress key={index} model={model} weeks={weeks}/>;
        },

        getTotal: function(weeks) {
            return <TotalProgress collection={this.props.collection} weeks={weeks} />
        },

        render: function() {
            var weeks = this.props.getWeeks();
            return (
                <section className="main">
                    <header className="header-main">
                        <h2>My Goals</h2>
                        <button 
                            className="button button-primary"
                            onClick={this.props.addGoal}>+ Goal
                        </button>
                        <button className="button button-primary"
                            onClick={this.props.addEntry}>+ Entry
                        </button>
                    </header>
                    <div className="results-toggle">
                        <button className="button button-secondary">To Date</button>
                        <button className="button">Week 5</button>
                    </div>
                    <article className="all-goals">
                        <div>{this.getTotal(weeks)}</div>
                        <hr />
                        <h3>Individual Goals</h3>
                        <div>{this.props.collection.map(this.getGoal.bind(this, weeks))}</div>
                    </article>
                </section>
            );
        }

    });



})(app.views);
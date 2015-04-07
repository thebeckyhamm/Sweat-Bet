(function(views){
    var Progress = React.createBackboneClass({
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
        render: function() {
            var goal = this.props.model.toJSON();
            var entries = goal.entries;

            var currentProgress = this.getCurrentTotal(entries);
            var totalGoal = goal.number * this.props.weeks;
            var percentComplete = ((currentProgress / totalGoal) * 100).toFixed(1);
            percentComplete = percentComplete + "%";
            var unit = goal.unit;
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
                    <span>{currentProgress} {unit} out of {totalGoal} </span>
                </div>
            );
        }

    });

    views.MyDash = React.createBackboneClass({

        getGoal: function(weeks, model, index) {
            return <Progress key={index} model={model} weeks={weeks}/>;
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
                        <h3>Total Progress</h3>
                        <span className="completion-rate completion-rate-lg">45%</span>
                        <div className="progress-bar progress-bar-lg"></div>
                        <hr />
                        <h3>Individual Goals</h3>
                        <div>{this.props.collection.map(this.getGoal.bind(this, weeks))}</div>
                    </article>
                </section>
            );
        }

    });



})(app.views);
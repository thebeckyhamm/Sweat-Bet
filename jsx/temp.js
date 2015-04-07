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
        var totalGoal = goal.number 
        var goalName = goal.name + " " + 
                   goal.number + " " + 
                   goal.unit + " " + 
                   goal.amountOfTime;
        return (
            <div className="goal-progress">
                <h4>{goalName}</h4>
                <span>{currentProgress} of {this.props.weeks}</span>
            </div>
        );
    }

});
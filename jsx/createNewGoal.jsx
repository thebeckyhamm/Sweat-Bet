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
                <div className="main">
                    <form onSubmit={this.onSubmit} className="form goal-form">
                        <h2>Set up your weekly goal.</h2>
                        <views.Input 
                            label="Goal Name" 
                            type="text" 
                            name="name"
                            placeholder="ex: Run"
                            required="required" />
                        <views.Input 
                            label="Number" 
                            type="number" 
                            name="number"
                            placeholder="5"
                            required="required" />  
                        <views.Select label="Unit (per week)" 
                            options={this.units} 
                            name="unit"
                            defaultValue="days" />
                        <div className="text-right"><button className="button button-primary">Add Goal</button></div>
                        
                    </form>
                </div>

            );
        }

    });

})(app.views);
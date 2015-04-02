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
                app.trigger("add:goal", goalItems);   
            }
        },

        render: function() {
            return (

                <form onSubmit={this.onSubmit} className="goal-form">
                    <views.Input 
                        label="Goal Name" 
                        type="text" 
                        name="goalName"
                        placeholder="ex: Run"
                        required="required" />
                    <views.Input 
                        label="Number" 
                        type="number" 
                        name="number"
                        placeholder="5"
                        required="required" />  
                    <views.Select label="Unit" 
                                options={this.units} 
                                name="unit"
                                defaultValue="times" />
                    <views.Select label="Time Interval" 
                                options={this.time}
                                name="amountOfTime"
                                defaultValue="per week" />
                    <div className="text-right"><button>Add Goal</button></div>
                    
                </form>

            );
        }

    });

})(app.views);
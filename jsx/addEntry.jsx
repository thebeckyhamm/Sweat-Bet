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
            start_date: moment(),
            end_date: moment(),
            new_date: null,
            bound_date: null,
            example5Selected: null
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

            // var userGoals = _.filter(collection, function(goal) {
            //     return app.currentUser.id === goal.user_id
            // });

            // var goalNames = [];
            // _.each(userGoals, function(goal) {
            //     var vals = _.values(goal);
            //     vals = vals.slice(0, 4);
            //     vals = vals.join(" ");
            //     goalNames.push(vals);
            // });
            // console.log(goalNames);
            // return goalNames;


        },

        render: function() {
            return (

                <form onSubmit={this.onSubmit} className="form form-entry">
                    <views.Select label="Goal" 
                        options={this.getGoalNames()} 
                        name="name" />
                    <views.Input 
                        label="Number Completed" 
                        type="number" 
                        name="number"
                        placeholder="5"
                        required="required" />
                    <label>Date Completed</label> 
                    <DatePicker selected={this.state.start_date} onChange={this.handleStartDateChange} />
                    <div className="text-right">
                        <button className="button button-primary">Add Entry</button>
                    </div>
                    
                </form>

            );
        }

    });

})(app.views);
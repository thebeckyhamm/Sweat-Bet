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
            start_date: null
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

        },

        render: function() {
            return (

                <form onSubmit={this.onSubmit} className="form form-entry">
                    <views.Select label="Goal" 
                        options={this.getGoalNames()} 
                        name="goal_id" />
                    <views.Input 
                        label="Completed (#)" 
                        type="number" 
                        name="number"
                        placeholder="5"
                        required="required" />
                    <div className="field">
                    <label>Date Completed</label> 
                    <DatePicker 
                        selected={this.state.start_date} 
                        onChange={this.handleStartDateChange}         
                        placeholderText="Click to select a date" 
                        maxDate={moment()}
                        weekStart="0" />  
                    </div>
                    <div className="text-right">
                        <button className="button button-primary">Add Entry</button>
                    </div>
                </form>

            );
        }

    });

})(app.views);
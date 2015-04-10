(function(views){

    views.CreateTeamForm = React.createClass({

        weeks: [8,9,10,11,12,13,14,15],

        onSubmit: function(e) {
            e.preventDefault();
            var teamOptions = $(e.target).serializeJSON();
            var states = _.map(teamOptions, function(item) {
                return !!item;
            });
            var containsFalse = _.contains(states, false);
            if (!containsFalse) {
                app.trigger("add:team", teamOptions);   
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

        render: function() {
            return (
                <div class="main create-team">
                    <div className="create-team-form">
                        <form onSubmit={this.onSubmit} className="form">
                            <h2>Create your team</h2>
                            <views.Input 
                                label="Team Name" 
                                type="text" 
                                name="name"
                                placeholder="ex: Eat My Dust"
                                required="required" />
                            <views.Input 
                                label="Bet per Person (in $)" 
                                type="number" 
                                name="number"
                                placeholder="ex: 25.00"
                                required="required" />  
                            <views.Select 
                                label="Length of Competition (in weeks)" 
                                options={this.weeks} 
                                name="weeks"
                                defaultValue="12" />
                            <div className="field">
                                <label>Date Completed</label> 
                                <DatePicker 
                                    selected={this.state.start_date} 
                                    onChange={this.handleStartDateChange}         
                                    placeholderText="Click to select a date" 
                                    weekStart="0" />  
                                </div>
                            <div className="text-right"><button className="button button-primary">Create Team</button></div>
                        </form>
                    </div>
                    <div className="create-team-sidebar">
                        <h4>Need a team name?</h4>
                        <p>Use <a href="http://www.wordlab.com/gen/team-name-generator.php">this team name generator</a> for ideas.</p>
                        <br />
                        <h4>How long should the competition be?</h4>
                        <p>We recommend your competition be at least 12 weeks in order for people to actually see changes in their lifestyle/body/etc.</p>
                    </div>
                </div>

            );
        }

    });



})(app.views);
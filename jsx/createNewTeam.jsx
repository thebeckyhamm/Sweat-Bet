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

        render: function() {
            return (

                <form onSubmit={this.onSubmit} className="form create-team-form">
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
                        label="# of Weeks for Competition" 
                        options={this.weeks} 
                        name="weeks"
                        defaultValue="12" />
                    <views.Input 
                        label="Start Date (please enter as 'MM/DD/YYYY')" 
                        type="text" 
                        name="start_date"
                        placeholder="ex: 11/14/2015"
                        required="required" />  
                    <div className="text-right"><button className="button button-primary">Create Team</button></div>
                </form>

            );
        }

    });



})(app.views);
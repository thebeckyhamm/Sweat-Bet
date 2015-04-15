(function(views){

    views.JoinTeam = React.createBackboneClass({
        selectTeam: function(model) {
            this.props.onTeamSelect(model);            
        },

        getTeam: function(model, index) {
            var startDate = moment(model.get("datepicker"));
            var now = moment();

            // if the start date has already passed
            if (now.diff(startDate, 'minutes') > 0) {
                return;
            }
            else {
                return (
                    <li key={index}><button className="button button-primary" onClick={this.selectTeam.bind(this, model)}>{model.get("name")}</button></li>
                ); 
            }
        },

        render: function() {
            if (this.props.collection.length === 0) {
                return (
                    <div className="main">
                        <div className="join-team">

                            <h2>We're fresh out of teams.</h2>
                            <button className="button button-primary" onClick={this.props.onCreateNew}>Create your own.</button>
                        </div>
                    </div>

                );
            }

            return (
                <div className="main">
                    <div className="join-team">
                        <h4>Choose the team you'd like to join.</h4>  
                        <ul className="list list-buttons">{this.props.collection.map(this.getTeam)}</ul>
                    </div>
                </div>
            );
        }

    });



})(app.views);
(function(views){

    views.JoinTeam = React.createBackboneClass({
        selectTeam: function(model) {
            this.props.onTeamSelect(model);            
        },

        getTeam: function(model, index) {
            return (
                <li key={index}><button className="button" onClick={this.selectTeam.bind(this, model)}>{model.get("name")}</button></li>
            );
        },

        render: function() {
            return (
                <div>
                    <h4>Choose the team you'd like to join.</h4>  
                    <ul className="list list-buttons">{this.props.collection.map(this.getTeam)}</ul>
                </div>
            );
        }

    });



})(app.views);
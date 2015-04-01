(function(views){

    views.TeamName = React.createBackboneClass({

        render: function() {
            return (
                <h2 className="team-name">{this.props.model.get("name")}</h2>  
            );
        }

    });



})(app.views);
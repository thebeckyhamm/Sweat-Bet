(function(views){

    views.JoinOrCreateTeam = React.createBackboneClass({

        render: function() {
            return (
                <div>
                    <h2>Hi {this.props.model.get("name")}! <br />Welcome to BetYourButt!</h2>
                    <div className="buttons-toggle">
                        <button className="button button-primary" onClick={this.props.onJoinSelect}>Join a Team</button>
                        <button className="button button-primary" onClick={this.props.onCreateNew}>Create New Team </button>
                    </div>
                </div>
  
            );
        }

    });



})(app.views);
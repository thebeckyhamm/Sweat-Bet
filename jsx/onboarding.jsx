(function(views){

    views.JoinOrCreateTeam = React.createBackboneClass({

        render: function() {
            return (
                <div className="main">
                    <div className="onboarding">
                        <h2>Hi, {this.props.model.get("name")}! <br />Welcome to SweatBet!</h2>
                        <br />
                        <div className="buttons-toggle">
                            <button className="button button-primary button-lg" onClick={this.props.onJoinSelect}>Join a Team</button>
                            <button className="button button-primary button-lg" onClick={this.props.onCreateNew}>Create New Team </button>
                        </div>
                    </div>
                </div>
  
            );
        }

    });



})(app.views);
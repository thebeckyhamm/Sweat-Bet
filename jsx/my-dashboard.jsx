(function(views){

    views.MyDash = React.createBackboneClass({

        getGoal: function(model, index) {
            var goalName;
            var name = model.get("name");
            var number = model.get("number");
            var unit = model.get("unit");
            var amountOfTime = model.get("amountOfTime");
            goalName = name + " " + number + " " + unit + " " + amountOfTime;
            return <h4 key={index}>{goalName}</h4>;
        },

        render: function() {

            return (
                <section className="main">
                    <header className="header-main">
                        <h2>My Goals</h2>
                        <button 
                            className="button button-primary"
                            onClick={this.props.addGoal}>+ Goal
                        </button>
                        <button className="button button-primary">+ Entry</button>
                    </header>
                    <div className="results-toggle">
                        <button className="button button-secondary">To Date</button>
                        <button className="button">Week 5</button>
                    </div>
                    <article className="all-goals">
                        <h3>Total Progress</h3>
                        <span className="completion-rate completion-rate-lg">45%</span>
                        <div className="progress-bar progress-bar-lg"></div>
                        <hr />
                        <h3>Individual Goals</h3>
                        <div>{this.props.collection.map(this.getGoal)}</div>
                    </article>
                </section>
            );
        }

    });



})(app.views);
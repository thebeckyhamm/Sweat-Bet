(function(views) {

var Input = React.createClass({
    render: function() {
        var htmlID = "textinput-" + name + Math.random();
        var type = this.props.type || "text";
        var label = this.props.label || this.props.name;
        var placeholder = this.props.placeholder || "";
        var value = this.props.value || "";
        var required = this.props.required || "";
        return (
            <div className="field">
                <label htmlFor={htmlID}>{label}</label>
                <input 
                    type={type} 
                    name={this.props.name}
                    htmlID={htmlID}
                    placeholder={placeholder} 
                    defaultValue={value}
                    required={required}
                />
            </div>
        );
    }

});

var Select = React.createClass({

    makeOption: function(option, index) {   
        var data = option;
        //console.log(option);
        var value = option["_id"] || option;

        if (option["name"]) {
            var concatName = option["name"] + " " +  
                             option["number"] + " " +
                             option["unit"] + " " +
                             "per week";
        }
        var name = concatName || option;
        //console.log(name, value);
        return <option key={index} value={value}>{name}</option>;

    },

    render: function() {
        var htmlID = "select-" + name + Math.random();
        var label = this.props.label || this.props.name;

        return (
            <div className="field field-select">
                <label htmlFor={htmlID}>{label}</label>
                <select htmlID={htmlID}
                        defaultValue={this.props.defaultValue}
                        name={this.props.name}>
                    {_.map(this.props.options, this.makeOption)}
                </select>
                
            </div>
        );
    }

});


views.Input = Input;
views.Select = Select;


})(app.views);

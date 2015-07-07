var socketURL = "ws://localhost:7000/";


function sendToServer(message) {
    websocket.send(JSON.stringify(new Message(message,"TESTER","UPDATE")));
}

function Message(message,user,command){
    this.message = message;
    this.user = user;
    this.command = command;
}


var MainWindow = React.createClass({
    getInitialState: function() {
        return {
            options: []
        }
    },
    componentDidMount: function() {

    },
    render: function() {
        return <div>
                    <ChatWindow/>
                </div>;
    }
});
var ChatWindow = React.createClass({
    getInitialState: function() {
        return {
            options: []
        }
    },
    componentDidMount: function() {
        var self = this;
        websocket = new WebSocket(socketURL);
        websocket.onopen = function(event) {
            self.sendToOutput(new Message("CONNECTED","STATUS","STATUS"));
            sendToServer("AUTHENTICATE");
        };
        websocket.onclose = function(event) {
            self.sendToOutput(new Message("DISCONNECTED","STATUS","STATUS"));
        };
        websocket.onmessage = function(event) {
            console.log(event.data);
            self.sendToOutput(JSON.parse(event.data));
        };
        websocket.onerror = function(event) {
            self.sendToOutput(event.data);
        };

    },
    sendToOutput : function(message){
        this.refs.chatOutput.writeMessage(message);
        console.log(message);
    },
    render: function() {
        return <div>
            <ChatOutput ref="chatOutput" outputCallTo={this.outputCallTo}/>
            <ChatInput/>
        </div>;
    }
});
var ChatOutput = React.createClass({
    getInitialState: function() {
        return {
            messages: []
        }
    },
    componentDidMount: function() {
        var self = this;

    },
    writeMessage: function(message){
        var self = this;
            self.state.messages.push(
                <div className="message">
                    <span className="message-user">{message.user}</span> : <span className="message-text">{message.message}</span>
                </div>
            );
        self.forceUpdate();
        $('.chatbox').scrollTop($('.chatbox').get(0).scrollHeight);
    },
    render: function() {
        return <div className="row">
            <div className="large-12 columns">
                <div className="chatbox">
                    {this.state.messages}
                </div>
            </div>
        </div>;
    }
});
var ChatInput = React.createClass({
    getInitialState: function() {
        return {
            options: []
        }
    },
    componentDidMount: function() {
        var self = this;
        $(".chat-input").keyup(function (e) {
            if (e.keyCode == 13) {
                self.sendMessage();
            }
        });
    },
    sendMessage: function(){
        sendToServer(this.refs.chatInput.getDOMNode().value);
        this.refs.chatInput.getDOMNode().value = "";
    },
    render: function() {
        return <div className="row">
                    <div className="large-12 columns">
                        <div className="row collapse">
                            <div className="small-10 columns">
                                <input ref="chatInput" type="text" className="chat-input"/>
                            </div>
                            <div className="small-2 columns">
                                <a href="#" className="button postfix" onClick={this.sendMessage}>Send</a>
                            </div>
                        </div>
                    </div>
                </div>;
    }
});
React.render(
    <MainWindow />,
    document.getElementById('main')
);
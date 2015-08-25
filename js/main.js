var socketURL = "ws://localhost:9001/chat"; // set to standard (non SSL) for local testing


function sendToServer(message) {
    if(typeof  message === 'string'){
        websocket.send(JSON.stringify(new Message(message, "TESTER", 1)));
    }else{
        websocket.send(JSON.stringify(message));
    }
}

function Message(message,user,code){
    this.message = message;
    this.user = user;
    this.code = code;
}


var MainWindow = React.createClass({
    getInitialState: function() {
        return {
            options: []
        }
    },
    componentDidMount: function() {
        var self = this;
        websocket = new WebSocket(socketURL);
        websocket.onopen = function(event) {
            self.sendToChatWindow(new Message("CONNECTED","STATUS",4));
        };
        websocket.onclose = function(event) {
            self.sendToChatWindow(new Message("DISCONNECTED","STATUS",4));
        };
        websocket.onmessage = function(event) {
            console.log(event.data);
            self.sendToChatWindow(JSON.parse(event.data));
        };
        websocket.onerror = function(event) {
            self.sendToChatWindow(event.data);
        };
    },
    sendToChatWindow: function(message){
        this.refs.chatWindow.recieve(message);
    },
    render: function() {
        return <div>
                    <LoginPane/>
                    <ChatWindow ref="chatWindow"/>
                </div>;
    }
});
var LoginPane = React.createClass({
    getInitialState: function() {
        return {
            options: []
        }
    },
    componentDidMount: function() {
        var self = this;
    },
    login : function(){
        var username = this.refs.userName.getDOMNode().value;
        this.refs.userName.getDOMNode().value = "";
        sendToServer(new Message(username,username,3))
    },
    render: function() {
        return <div className="row">
            <div className="large-12 columns">
                <input ref="userName" type="text" placeholder="Username"/>
            </div>
            <button href="#" className="button" onClick={this.login}>Login</button>

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

    },
    recieve: function(message){
        this.sendToOutput(message);
    },
    sendToOutput : function(message){
        this.refs.chatOutput.writeMessage(message);
        console.log(message);
    },
    render: function() {
        return <div>
            <ChatOutput ref="chatOutput"/>
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
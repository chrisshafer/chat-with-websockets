var wsUri = "ws://localhost:7000/";


function sendToServer(message) {
    websocket.send(message);
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
        websocket = new WebSocket(wsUri);
        websocket.onopen = function(evt) {
            onOpen(evt);
        };
        websocket.onclose = function(evt) {
            onClose(evt);
        };
        websocket.onmessage = function(evt) {
            self.sendToOutput(evt.data);
        };
        websocket.onerror = function(evt) {
            onError(evt);
        };
        function onOpen(evt) {
            self.sendToOutput("CONNECTED");
            sendToServer("AUTHENTICATE");
        }
        function onClose(evt) {
            self.sendToOutput("DISCONNECTED");
        }
        function onMessage(evt) {
            self.sendToOutput('RESPONSE: ' + evt.data);
        }
        function onError(evt) {
            self.sendToOutput('ERROR: ' + evt.data);
        }
    },
    sendToOutput : function(message){
        this.refs.chatOutput.notify(message);
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
    notify: function(message){
        var self = this;
            self.state.messages.push(
                <div>{message}</div>
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
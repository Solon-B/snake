const GameEvent = {
  System: 'system',
  End: 'gameEnd',
  Start: 'gameStart',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class GameEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    this.socket.onopen = (event) => {
      this.receiveEvent(new EventMessage('Simon', GameEvent.System, { msg: 'connected' }));
    };
    this.socket.onclose = (event) => {
      this.receiveEvent(new EventMessage('Simon', GameEvent.System, { msg: 'disconnected' }));
    };
    this.socket.onmessage = (msg) => {
      this.handleWebSocketData(msg.data);
    };
  }

  async handleWebSocketData(data) {
    try {
      console.log('Received WebSocket data:', data);

      let textData;

      if (data instanceof Blob) {
        // Handle Blob data
        textData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsText(data);
        });
      } else {
        // Handle JSON data
        textData = data;
      }

      console.log('Text data:', textData);
      this.receiveEvent(JSON.parse(textData));
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);

    // Assuming the type 'gameStart' and 'gameEnd' are used for game-related events
    if (type === GameEvent.Start || type === GameEvent.End) {
      // Send the game-related events to the server
      this.sendToServer(event);
    } else {
      // Otherwise, send the event to other clients
      this.socket.send(JSON.stringify(event));
    }
  }

  sendToServer(event) {
    // Adjust this function based on your server's API
    fetch('/api/gameEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
      .then((response) => response.json())
      .then((data) => console.log('Server response:', data))
      .catch((error) => console.error('Error sending event to server:', error));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.handlers.forEach((handler) => {
      handler(event);
    });
  }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };

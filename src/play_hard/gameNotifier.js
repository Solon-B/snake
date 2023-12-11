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
      console.log('WebSocket connection opened successfully');
      this.receiveEvent(new EventMessage(getPlayerName(), GameEvent.System, { msg: 'connected' }));
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed');
      this.receiveEvent(new EventMessage(getPlayerName(), GameEvent.System, { msg: 'disconnected' }));
    };

    this.socket.onmessage = async (msg) => {
      try {
        let textData;
    
        if (msg.data instanceof Blob) {
          // Handle Blob data
          textData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(msg.data);
          });
        } else {
          // Handle other data types (such as strings)
          textData = msg.data;
        }
    
        console.log('Received WebSocket data:', textData);
        const event = JSON.parse(textData);
        this.receiveEvent(event);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
  }

  broadcastEvent(from, type, value) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const event = new EventMessage(from, type, value);
      this.socket.send(JSON.stringify(event));
    } else {
      console.error('WebSocket connection is not open');
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    console.log('Received event:', event); // Add this line to log the received event

    this.events.push(event);

    this.handlers.forEach((handler) => {
      handler(event);
    });
  }
}

function getPlayerName() {
  const playerName = localStorage.getItem('userName');
  return playerName || 'Mystery Player';
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier, getPlayerName };

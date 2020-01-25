export default class BaseAPI {
  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || '/api/v1';
  }

  getAvailableStreams() {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiBaseUrl}/streams`)
      .then(response => response.json())
      .then(streams => {
        resolve(streams);
      });
    })
  }

  getStreamById(id) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiBaseUrl}/streams/${id}`)
      .then(response => response.json())
      .then(stream => {
        resolve(stream);
      });
    });    
  }

  updateStream(stream) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiBaseUrl}/streams/${stream.id}`, { 
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stream)
      })
      .then(response => response.json())
      .then(stream => {
        resolve(stream);
      })
    });
  }

  async startStream(stream) {
    stream.state = 'starting';
    return await this.updateStream(stream);
  }

  async stopStream(stream) {
    stream.state = 'stopping';
    return await this.updateStream(stream);
  }
}
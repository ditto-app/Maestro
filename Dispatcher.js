import Store from './Store';
import Logger from './Logger';

class Dispatcher {
  _store = null;
  _linkedInstances = [];

  constructor() {
    this._store = new Store(this.constructor.initialStore);
  }

  get dispatchKey() {
    throw new Error('Maestro dispatchers must override get dispatchKey()');
  }

  get store() {
    return this._store.getData();
  }

  dispatchEvent(name, value) {
    Logger.log([
      `Dispatching event: ${name}`,
      'With value:',
      value,
      'Available to linked instances:',
      this._linkedInstances,
    ]);

    this._linkedInstances.forEach(classInstance => {
      if (classInstance.receiveEvent) {
        classInstance.receiveEvent(name, value, this.dispatchKey);
      }
    });
  }

  dispatchStoreUpdate() {
    this._linkedInstances.forEach(linkedInstance => {
      if (linkedInstance.receiveStoreUpdate) {
        linkedInstance.receiveStoreUpdate(this.store, this.dispatchKey);
      }
    });
  }

  link(classInstance) {
    this._linkedInstances.push(classInstance);
  }

  unlink(classInstance) {
    this._linkedInstances = this._linkedInstances.filter(linkedInstance => {
      return (linkedInstance !== classInstance);
    });
  }
}

export default Dispatcher;

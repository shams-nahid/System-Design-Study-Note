const { LinkedList, Node } = require('./doubly-link-list');

const MAX_HASHMAP_SIZE = 3;

class HashMap {
  constructor() {
    this.linkedList = new LinkedList();
    this.size = 0;
    this.dataMap = {};
  }

  insert({ key, value }) {
    // When we are max size and inserting a new data
    // remove the last data from hash map
    // remove the last one from linked list
    if (!this.dataMap[key] && this.size === MAX_HASHMAP_SIZE) {
      // get oldest used data
      const lastNode = this.linkedList.tail;


      // remove oldest from hashmap
      if (lastNode) {
        delete this.dataMap[lastNode.data.key];
      }

      // remove oldest node from linked list
      this.linkedList.removeLast();

      this.size--;
    }

    this.linkedList.insert(new Node({ key, value }));
    this.dataMap[key] = this.linkedList.head;

    this.size++;
  }

  remove() { }

  get(key) {
    if (!this.dataMap[key]) {
      return null;
    }
    // make head first
    console.log(this.dataMap[key])
    this.linkedList.makeHead(this.dataMap[key])
    return this.dataMap[key].data.value;
  }
}

module.exports = {
  HashMap
}
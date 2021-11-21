class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    insert(node) {
        if (!this.head) {
            this.head = node;
            this.tail = node;
            return;
        }
        this.head.prev = node;
        node.next = this.head;
        this.head = node;
    }

    makeHead(node) {
        // when linked list is empty
        if (!this.head) {
            this.head = node;
            this.tail = node;
            return;
        }

        // node is already head
        if (node === this.head) {
            return;
        }

        // node is a tail node
        if (node.next === null) {
            const previousNode = node.prev;
            previousNode.next = null;
            node.prev = null;
            node.next = this.head.next;
            this.head = node;
            this.tail = previousNode;
            return;
        }

        // node is in the middle, so remove it
        node.prev.next = node.next;
        node.next.prev = node.prev;

        // make the node as head
        node.next = this.head.next;
        node.prev = null;
        this.head = node;
    }

}

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

module.exports = {
    Node,
    LinkedList
}
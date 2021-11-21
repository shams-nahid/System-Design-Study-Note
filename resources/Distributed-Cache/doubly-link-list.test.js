const { Node, LinkedList } = require('./doubly-link-list');

describe('Doubly Link List', () => {
    let node;
    beforeEach(() => {
        node = new Node('Some Data');
    });

    it('should be defined', () => {
        expect(node).toBeDefined();
        expect(node.data).toEqual('Some Data');
    });

    describe('LinkedList', () => {
        let linkedList;
        beforeEach(() => {
            linkedList = new LinkedList();
        });

        it('should be defined', () => {
            expect(linkedList).toBeDefined();
            expect(linkedList.head).toBeNull();
            expect(linkedList.tail).toBeNull();
        });

        describe('insert operation', () => {
            it('should able to insert node when head is null', () => {
                expect(typeof linkedList.insert).toBe('function');
                const newNode = new Node('Some Data');
                linkedList.insert(newNode);
                expect(linkedList.head).toEqual(newNode);
                expect(linkedList.tail).toEqual(newNode);
            });

            it('should able to insert node when head is not null', () => {
                expect(typeof linkedList.insert).toBe('function');
                const firstInsertedNode = new Node('First Node Data');
                linkedList.insert(firstInsertedNode);
                const secondInsertedNode = new Node('Second Node Data');
                linkedList.insert(secondInsertedNode);
                expect(linkedList.head.data).toEqual(secondInsertedNode.data);
                expect(linkedList.tail.data).toEqual(firstInsertedNode.data);
                expect(secondInsertedNode.next).toEqual(firstInsertedNode)
                expect(secondInsertedNode.prev).toEqual(null)
                expect(firstInsertedNode.next).toEqual(null)
                expect(firstInsertedNode.prev).toEqual(secondInsertedNode)
            });
        });

        describe('make head', () => {
            it('should make head when the link list is empty', () => {
                const newNode = new Node('Some Data');
                linkedList.makeHead(newNode);
                expect(linkedList.head).toBe(newNode);
                expect(linkedList.tail).toBe(newNode);
            });

            it('should not update if the node is already head', () => {
                const newNode = new Node('Some Data');
                linkedList.insert(newNode);
                linkedList.makeHead(newNode);
                expect(linkedList.head).toBe(newNode);
                expect(linkedList.tail).toBe(newNode);
            });

            it('should make the tail node as head', () => {
                const tailNode = new Node('Initial tail');
                const headNode = new Node('Initial Head');
                linkedList.insert(tailNode);
                linkedList.insert(headNode);

                expect(linkedList.head).toEqual(headNode);
                expect(linkedList.tail).toEqual(tailNode);

                linkedList.makeHead(tailNode);

                expect(linkedList.head).toEqual(tailNode);
                expect(linkedList.tail).toEqual(headNode);
            });

            it('should make the middle node as head', () => {
                const tailNode = new Node('Initial tail');
                const middleNode = new Node('Middle Node');
                const headNode = new Node('Initial Head');

                linkedList.insert(tailNode);
                linkedList.insert(middleNode);
                linkedList.insert(headNode);

                expect(linkedList.head).toEqual(headNode);
                expect(linkedList.tail).toEqual(tailNode);

                linkedList.makeHead(middleNode);
                expect(linkedList.head).toEqual(middleNode);
                expect(linkedList.tail).toEqual(tailNode);
            });
        });

    });
});
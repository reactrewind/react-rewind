class DoublyLinkedListNode {
  constructor(value, next = null, previous = null) {
    this.value = value;
    this.next = next;
    this.previous = previous;
  }
}

class DoublyLinkedList {
  constructor() {
    this.tail = null;
    this.current = null;
  }

  append(fiberNode) {
    const newDLLNode = new DoublyLinkedListNode(fiberNode);

    if (!this.head) {
      this.tail = newDLLNode;
      this.current = newDLLNode;
    } else {
      this.tail.next = newDLLNode;
      newDLLNode.previous = this.tail;
      this.tail = newDLLNode;
    }

    return this;
  }
}

const fnArray = [];

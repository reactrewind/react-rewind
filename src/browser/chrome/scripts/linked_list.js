class DoublyLinkedListNode {
  constructor(value, next = null, prev = null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
  }

  append(fiberNode) {
    const newDLLNode = new DoublyLinkedListNode(fiberNode);

    if (!this.head) {
      this.head = newDLLNode;
      this.tail = newDLLNode;
      this.current = newDLLNode;
    } else {
      this.tail.next = newDLLNode;
      newDLLNode.prev = this.tail;
      this.tail = newDLLNode;
    }

    return this;
  }
}

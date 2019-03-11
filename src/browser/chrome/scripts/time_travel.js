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


const funcStorage = {};
let root = null;
const timeTravelLList = new DoublyLinkedList();

function timeTravel(direction) {
  if (!root) {
    root = getRootContainerInstance(timeTravelLList.current.value.effect);
    timeTravelLList.current = timeTravelLList.tail;
  }

  const diff = direction === 'forward' ? 1 : -1;

  if ((diff === 1 && timeTravelLList.current.next === null)
    || (diff === -1 && timeTravelLList.current.prev === null)) {
    return;
  }

  if (diff === 1 && timeTravelLList.current !== timeTravelLList.tail) {
    timeTravelLList.current = timeTravelLList.current.next;
  }

  const {
    commitDeletion,
    commitPlacement,
    commitWork,
    prepareUpdate,
  } = funcStorage;

  while (true) {
    // console.log('doing work for ', timeTravelTrackerIndex);
    const { primaryEffectTag, effect } = timeTravelLList.current.value;

    switch(primaryEffectTag) {
      case 'UPDATE': {
        const { current } = timeTravelLList.current.value;
        
        // if we are moving forwards, we need to commitWork() the same
        // way the function was originally called.
        if (diff === 1) {
          commitWork(_.cloneDeep(current), _.cloneDeep(effect));
          break;
        }

        // TODO: hacky solution. There must be some other edge-cases, so
        // we should perform this check in a more generalized way.
        if (effect.tag !== 6) {
          // if the fiberNode is a HostText (tag = 6), the effect does NOT
          // have an updateQueue. Otherwise, we need to get the .updateQueue
          // value that represents this backwards transformation. This value
          // is returned by the prepareUpdate function.
          const payload = prepareUpdate(
            effect.stateNode,
            effect.type,
            effect.memoizedProps,
            current.memoizedProps,
            root,
            {},
          );

          const currentCopy = _.cloneDeep(current);
          currentCopy.updateQueue = payload;
          commitWork(_.cloneDeep(effect), currentCopy);
          break;
        }

        commitWork(_.cloneDeep(effect), _.cloneDeep(current));
        break;
      }
      case 'PLACEMENT': {
        if (diff === 1) {
          commitPlacement(_.cloneDeep(effect));
        } else {
          // commitDeletion() will call unmountHostComponents(), which recursively
          // deletes all host nodes from the parent. This means that
          // effect.return = null.  BUT we need that reference for later calls
          // on commitPlacement() on this same node. This is why we need to clone
          // the effect fiberNode and call commitDeletion() on that instead.
          const effectCopy = _.cloneDeep(effect);
          commitDeletion(effectCopy);
        }
        break;
      }
      case 'DELETION': {
        if (diff === 1) {
          // Refer to case 'PLACEMENT' as to why we need to clone.
          const effectCopy = _.cloneDeep(effect);
          commitDeletion(effectCopy);
        } else {
          commitPlacement(_.cloneDeep(effect));
        }
        break;
      }
      default:
        break;
    }

    // break points for the while loop
    if ((diff === -1 && timeTravelLList.current.prev === null)
      || (diff === 1 && timeTravelLList.current.next === null)
      || (diff === 1 && timeTravelLList.current.value.actionDispatched)) {
      return;
    }

    timeTravelLList.current = diff === 1
      ? timeTravelLList.current.next
      : timeTravelLList.current.prev;

    if (diff === -1 && timeTravelLList.current.value.actionDispatched) {
      return;
    }
  }
}

function getRootContainerInstance(fiberNode) {
  let current = fiberNode;
  while (current.return) current = current.return;
  return current.stateNode.containerInfo;
}

window.addEventListener('message', (msg) => {
  if (msg.data.type === 'TIMETRAVEL') {
    timeTravel(msg.data.direction);
  }
});

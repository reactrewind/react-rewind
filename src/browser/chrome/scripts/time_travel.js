let timeTravelTracker = [];
let timeTravelTrackerIndex = null;

// TODO: we need a function to get a reference to the root container instance.
const root2 = document.querySelector('#content');

function timeTravel(direction) {
  if (timeTravelTrackerIndex === null) {
    // First time we call this function. We need to remove the PLACEMENT entry
    // from position [0]. This is originated from the initial mount of the App.
    timeTravelTracker = timeTravelTracker.slice(1);
    timeTravelTrackerIndex = timeTravelTracker.length - 1;
  }

  const diff = direction === 'forward' ? 1 : -1;

  if ((diff === 1 && timeTravelTrackerIndex === timeTravelTracker.length - 1)
    || (diff === -1 && timeTravelTrackerIndex === 0)) {
    return;
  }

  if (diff === 1 && timeTravelTrackerIndex !== 0) timeTravelTrackerIndex += 1;

  while (true) {
    console.log('doing work for ', timeTravelTrackerIndex);
    const { primaryEffectTag, effect } = timeTravelTracker[timeTravelTrackerIndex];

    switch(primaryEffectTag) {
      case 'UPDATE': {
        const { current } = timeTravelTracker[timeTravelTrackerIndex];
        
        // if we are moving forwards, we need to commitWork() the same
        // way the function was originally called.
        if (diff === 1) {
          commitWork(current, effect);
          break;
        }

        // TODO: hacky solution. There must be some other edge-cases, so
        // we should perform this check in a more generalized way.
        if (effect.tag !== 6) {
          // if the fiberNode is a HostText (tag = 6), the effect does NOT
          // have a updateQueue. Otherwise, we need to get the .updateQueue
          // value that represents this backwards transformation. This value
          // is returned by the prepareUpdate function.
          const rootContainerInstance = root2;
          const payload = prepareUpdate(
            effect.stateNode,
            effect.type,
            effect.memoizedProps,
            current.memoizedProps,
            rootContainerInstance,
            {},
          );

          current.updateQueue = payload;
        }

        commitWork(effect, current);
        break;
      }
      case 'PLACEMENT': {
        if (diff === 1) {
          commitPlacement(effect);
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
          commitPlacement(effect);
        }
        break;
      }
      default:
        break;
    }

    // break points for the while loop
    if (timeTravelTrackerIndex + diff === timeTravelTracker.length
      || (diff === -1 && timeTravelTrackerIndex === 0)
      || (diff === 1 && timeTravelTracker[timeTravelTrackerIndex].actionDispatched)) {
      return;
    }

    timeTravelTrackerIndex += diff;

    if (diff === -1 && timeTravelTracker[timeTravelTrackerIndex].actionDispatched) {
      return;
    }
  }
}

window.addEventListener('message', (msg) => {
  if (msg.data.type === 'TIMETRAVEL') {
    timeTravel(msg.data.direction);
  }
});

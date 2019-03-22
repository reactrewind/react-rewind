function stateDifference(old, curr) {
  if (typeof old !== typeof curr) return curr;

  if (typeof old === typeof curr && !Array.isArray(old) && typeof old !== 'object') {
    if (old === curr) return undefined;
    return curr;
  }

  if (Array.isArray(old) && Array.isArray(curr)) {
    const newArr = [];
    for (let i = 0; i < curr.length; i++) {
      if (!old.includes(curr[i])) {
        const result = stateDifference(old[i], curr[i]);
        if (result !== undefined) {
          newArr.push(result);
        }
      }
    }

    return newArr.length > 0 ? newArr : undefined;
  }

  const newObj = {};
  for (let prop in curr) {
    const result = stateDifference(old[prop], curr[prop])
    if (result !== undefined) {
      newObj[prop] = result;
    }
  }

  return Object.keys(newObj).length === 0 ? undefined : newObj;
}

export default stateDifference;

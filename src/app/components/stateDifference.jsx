
function stateDifference(old, curr) {
  
    if(typeof(old) === "string" && typeof(curr) === "string") {
      if(old === curr) return false;
      return curr;
    }
    else if(typeof(old) === "number" && typeof(curr) === "number") {
       if( old === curr) return false;
       return curr;
    }
    else if(typeof(old) !== typeof(curr)) {
      return curr;
    }
    else if(Array.isArray(old) && Array.isArray(curr)) {
      let newArr = [];
      for ( let i = 0; i < curr.length; i++){
        if(!old.includes(curr[i])){
          let result = stateDifference(old[i], curr[i])
          if (result) {
            newArr.push(result)
          }
        }
      } 
      return newArr.length > 0 ? newArr : false;
    }
    else if(typeof(old) === "object" && typeof(curr) === "object") {
      let newObj = {}
      for ( let prop in curr) {
        result = stateDifference(old[prop], curr[prop])
        if (result){
          newObj[prop] = result
        }
      }
      return Object.keys(newObj).length === 0 ? false : newObj
    }
  }

  export default stateDifference;
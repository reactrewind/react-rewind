module.exports =  `
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

const _ = {};
(function() {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function(r) {
          var n = e[i][1][r];
          return o(n || r)
        }, p, p.exports, r, e, n, t)
      }
      return n[i].exports
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o
  }
  return r
})()({
  1: [function(require, module, exports) {
    (function(global) {
      var LARGE_ARRAY_SIZE = 200;
      var HASH_UNDEFINED = '__lodash_hash_undefined__';
      var MAX_SAFE_INTEGER = 9007199254740991;
      var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        weakMapTag = '[object WeakMap]';
      var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reFlags = /\w*$/;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      var cloneableTags = {};
      cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
      var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function('return this')();
      var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;

      function addMapEntry(map, pair) {
        map.set(pair[0], pair[1]);
        return map;
      }

      function addSetEntry(set, value) {
        set.add(value);
        return set;
      }

      function arrayEach(array, iteratee) {
        var index = -1,
          length = array ? array.length : 0;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }

      function arrayPush(array, values) {
        var index = -1,
          length = values.length,
          offset = array.length;
        while (++index < length) {
          array[offset + index] = values[index];
        }
        return array;
      }

      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1,
          length = array ? array.length : 0;
        if (initAccum && length) {
          accumulator = array[++index];
        }
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }

      function baseTimes(n, iteratee) {
        var index = -1,
          result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }

      function getValue(object, key) {
        return object == null ? undefined : object[key];
      }

      function isHostObject(value) {
        var result = false;
        if (value != null && typeof value.toString != 'function') {
          try {
            result = !!(value + '');
          } catch (e) {}
        }
        return result;
      }

      function mapToArray(map) {
        var index = -1,
          result = Array(map.size);
        map.forEach(function(value, key) {
          result[++index] = [key, value];
        });
        return result;
      }

      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }

      function setToArray(set) {
        var index = -1,
          result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;
      var coreJsData = root['__core-js_shared__'];
      var maskSrcKey = (function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
        return uid ? ('Symbol(src)_1.' + uid) : '';
      }());
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectToString = objectProto.toString;
      var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      var Buffer = moduleExports ? root.Buffer : undefined,
        Symbol = root.Symbol,
        Uint8Array = root.Uint8Array,
        getPrototype = overArg(Object.getPrototypeOf, Object),
        objectCreate = Object.create,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        splice = arrayProto.splice;
      var nativeGetSymbols = Object.getOwnPropertySymbols,
        nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
        nativeKeys = overArg(Object.keys, Object);
      var DataView = getNative(root, 'DataView'),
        Map = getNative(root, 'Map'),
        Promise = getNative(root, 'Promise'),
        Set = getNative(root, 'Set'),
        WeakMap = getNative(root, 'WeakMap'),
        nativeCreate = getNative(Object, 'create');
      var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map),
        promiseCtorString = toSource(Promise),
        setCtorString = toSource(Set),
        weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol ? Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

      function Hash(entries) {
        var index = -1,
          length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
      }

      function hashDelete(key) {
        return this.has(key) && delete this.__data__[key];
      }

      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? undefined : result;
        }
        return hasOwnProperty.call(data, key) ? data[key] : undefined;
      }

      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
      }

      function hashSet(key, value) {
        var data = this.__data__;
        data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype['delete'] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;

      function ListCache(entries) {
        var index = -1,
          length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function listCacheClear() {
        this.__data__ = [];
      }

      function listCacheDelete(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        return true;
      }

      function listCacheGet(key) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        return index < 0 ? undefined : data[index][1];
      }

      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }

      function listCacheSet(key, value) {
        var data = this.__data__,
          index = assocIndexOf(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype['delete'] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;

      function MapCache(entries) {
        var index = -1,
          length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function mapCacheClear() {
        this.__data__ = {
          'hash': new Hash,
          'map': new(Map || ListCache),
          'string': new Hash
        };
      }

      function mapCacheDelete(key) {
        return getMapData(this, key)['delete'](key);
      }

      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }

      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }

      function mapCacheSet(key, value) {
        getMapData(this, key).set(key, value);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype['delete'] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;

      function Stack(entries) {
        this.__data__ = new ListCache(entries);
      }

      function stackClear() {
        this.__data__ = new ListCache;
      }

      function stackDelete(key) {
        return this.__data__['delete'](key);
      }

      function stackGet(key) {
        return this.__data__.get(key);
      }

      function stackHas(key) {
        return this.__data__.has(key);
      }

      function stackSet(key, value) {
        var cache = this.__data__;
        if (cache instanceof ListCache) {
          var pairs = cache.__data__;
          if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
            pairs.push([key, value]);
            return this;
          }
          cache = this.__data__ = new MapCache(pairs);
        }
        cache.set(key, value);
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype['delete'] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;

      function arrayLikeKeys(value, inherited) {
        var result = (isArray(value) || isArguments(value)) ? baseTimes(value.length, String) : [];
        var length = result.length,
          skipIndexes = !!length;
        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
            result.push(key);
          }
        }
        return result;
      }

      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || (value === undefined && !(key in object))) {
          object[key] = value;
        }
      }

      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }

      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }

      function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
        var result;
        if (customizer) {
          result = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result !== undefined) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            if (isHostObject(value)) {
              return object ? value : {};
            }
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) {
              return copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag, baseClone, isDeep);
          }
        }
        stack || (stack = new Stack);
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (!isArr) {
          var props = isFull ? getAllKeys(value) : keys(value);
        }
        arrayEach(props || value, function(subValue, key) {
          if (props) {
            key = subValue;
            subValue = value[key];
          }
          assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
        });
        return result;
      }

      function baseCreate(proto) {
        return isObject(proto) ? objectCreate(proto) : {};
      }

      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }

      function baseGetTag(value) {
        return objectToString.call(value);
      }

      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }

      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }
        return result;
      }

      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var result = new buffer.constructor(buffer.length);
        buffer.copy(result);
        return result;
      }

      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array(result).set(new Uint8Array(arrayBuffer));
        return result;
      }

      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }

      function cloneMap(map, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
        return arrayReduce(array, addMapEntry, new map.constructor);
      }

      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }

      function cloneSet(set, isDeep, cloneFunc) {
        var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
        return arrayReduce(array, addSetEntry, new set.constructor);
      }

      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }

      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }

      function copyArray(source, array) {
        var index = -1,
          length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }

      function copyObject(source, props, object, customizer) {
        object || (object = {});
        var index = -1,
          length = props.length;
        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
          assignValue(object, key, newValue === undefined ? source[key] : newValue);
        }
        return object;
      }

      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }

      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }

      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
      }

      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined;
      }
      var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
      var getTag = baseGetTag;
      if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) || (Map && getTag(new Map) != mapTag) || (Promise && getTag(Promise.resolve()) != promiseTag) || (Set && getTag(new Set) != setTag) || (WeakMap && getTag(new WeakMap) != weakMapTag)) {
        getTag = function(value) {
          var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result;
        };
      }

      function initCloneArray(array) {
        var length = array.length,
          result = array.constructor(length);
        if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }

      function initCloneObject(object) {
        return (typeof object.constructor == 'function' && !isPrototype(object)) ? baseCreate(getPrototype(object)) : {};
      }

      function initCloneByTag(object, tag, cloneFunc, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return cloneMap(object, isDeep, cloneFunc);
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return cloneSet(object, isDeep, cloneFunc);
          case symbolTag:
            return cloneSymbol(object);
        }
      }

      function isIndex(value, length) {
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (typeof value == 'number' || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }

      function isKeyable(value) {
        var type = typeof value;
        return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean') ? (value !== '__proto__') : (value === null);
      }

      function isMasked(func) {
        return !!maskSrcKey && (maskSrcKey in func);
      }

      function isPrototype(value) {
        var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
        return value === proto;
      }

      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {}
          try {
            return (func + '');
          } catch (e) {}
        }
        return '';
      }

      function cloneDeep(value) {
        return baseClone(value, true, true);
      }

      function eq(value, other) {
        return value === other || (value !== value && other !== other);
      }

      function isArguments(value) {
        return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
      }
      var isArray = Array.isArray;

      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }

      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      var isBuffer = nativeIsBuffer || stubFalse;

      function isFunction(value) {
        var tag = isObject(value) ? objectToString.call(value) : '';
        return tag == funcTag || tag == genTag;
      }

      function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }

      function isObject(value) {
        var type = typeof value;
        return !!value && (type == 'object' || type == 'function');
      }

      function isObjectLike(value) {
        return !!value && typeof value == 'object';
      }

      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }

      function stubArray() {
        return [];
      }

      function stubFalse() {
        return false;
      }
      module.exports = cloneDeep;
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
  }, {}],
  2: [function(require, module, exports) {
    _.cloneDeep = require('lodash.clonedeep');
  }, {
    "lodash.clonedeep": 1
  }]
}, {}, [2]);
`
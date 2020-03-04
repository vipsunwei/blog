# javascript 随手记

## 获取字符串字节长度

```JavaScript
const getByteLen = str => {
  if (!str) return 0
  if (typeof str !== 'string') {
    str += ''
  }
  return str.replace(/[^\x00-\xff]/g, '01').length
}
```

## 继承机制

### 一、混合模式

```JavaScript
/**
 * 混合方式
 *
 * 这种继承方式使用构造函数定义类，并非使用任何原型。
 * 对象冒充的主要问题是必须使用构造函数方式，这不是最好的选择。
 * 不过如果使用原型链，就无法使用 带参数的构造函数了。
 * 开发者如何选择呢？答案很简单，两者都用。
 *
 * 创建类的最好方式是用构造函数定义属性，用原型定义方法。
 * 这种方式同样适用于继承机制，用对象冒充继承构造函数的属性，用原型链继承 prototype 对象的方法。
 * 用这两种方式写个例子，代码如下：
 */
function ClassA(name) {
  this.name = name;
}

ClassA.prototype.sayName = function () {
  console.log(this.name);
};

function ClassB(name, age) {
  ClassA.call(this, name); // 用对象冒充继承构造函数的属性
  this.age = age;
}

ClassB.prototype = new ClassA(); // 用原型链继承 prototype 对象的方法。

ClassB.prototype.sayAge = function () {
  console.log(this.age);
};

var objA = new ClassA("李雷A");
var objB = new ClassB("李雷B", 20);

objA.sayName();	// 输出 "李雷A"

objB.sayAge();	// 输出 20
objB.sayName();	// 输出 "李雷B"
```

## JavaScript 对象 or 数组深拷贝

```JavaScript
/**
 * 1. 声明一个 deepCopy 函数；
 * 2. 声明一个变量 target，根据数据源（ source ）格式给其赋初始值；
 * 3. for...in 循环遍历对象 or 数组，如果当前属性 source[key] 不是对象，
 *    就把 source[key] 复制到 target 中，如果是个对象就递归调用 deepCopy 函数，
 *    直到所有属性不再是对象为止，拷贝结束。
 */
const obj = {
  k0: null,
  k2: undefined,
  k5: true,
  k6: false,
  k7: 0,
  k9: '',
  k1: 1,
  k3: [],
  k4: function () {
    console.log('我是k4函数')
  },
  k21: {
    k3: 3,
    k4: 4,
    k5: {
      k6: 6,
      k7: 7,
      k8: {
        k9: 9,
        k10: [1, 2, 3, 4, 5, 6, 7, {
          k1: 1,
          k2: 2,
          k3: null,
          k4: [ 444, 555 ]
        }]
      }
    }
  }
}

const deepCopy = (source) => {
  const target = Array.isArray(source) ? [] : {}
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        target[key] = deepCopy(source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

const res = deepCopy(obj)

console.log('obj: ', obj)
console.log('res: ', res)
console.log(obj === res) // 输出false 代表着两个对象没有引用关系了， 是两个不同的对象， 只是长得一样。

```

## JavaScript 实现冒泡排序与快速排序

### 一、冒泡排序

#### 冒泡排序的原理：

冒泡排序对相邻元素进行两两比较，如果顺序不对，就要对其位置进行调换，一直到排序完成。比如第一趟比较：首先比较第一个和第二个数的大小，将小数放前，大数放后。然后比较第二个数和第三个数的大小，再将小数放前，大数放后。以此类推，直到比较完最后两个数，第一趟就比较完了。重复第一趟过程，若有 n 个数，就要比较 n-1 趟。

#### 冒泡排序的图解：

<!-- <img style="margin-top:20px" src="https://user-gold-cdn.xitu.io/2019/9/19/16d482878a7f51eb?w=811&h=253&f=gif&s=376455" /> -->
<img style="margin-top:20px" src="/blog/img/bubble-sort.gif" />

在 JavaScript 中可以使用双重循环，外层循环控制比较多少趟，内层循环每一趟比较的次数。

```JavaScript
const arr1 = [2, 10, 5, 4, 11, 9, 7, 8, 1, 12, 3, 6, 13, 15, 14]

const bubbleSort = (arr) => {
  for (let j = 0; j < arr.length - 1; j++) {
    let isOk = true
    for (let i = 0; i < arr.length - 1 - j; i++) {
      let prev = arr[i]
      let next = arr[i + 1]
      if (prev > next) {
        arr[i] = next
        arr[i + 1] = prev
        isOk = false
      }
    }
    if (isOk) {
      break
    }
  }
  return arr
}

const res = bubbleSort(arr1)

console.log(res)

```

#### 冒泡排序的缺点：

但是冒泡排序也有一定的缺点，就是在比较过程中小的数不能一次到位，会导致效率低。所以一般不会选择冒泡排序，虽然冒泡排序书写是最简单的，但是平均性能没有选择排序好。

### 二、快速排序

#### 快速排序的思想：

「 _**快速排序**_ 」的思想很简单，整个排序过程只需要三步：

> 1. 从数组中选择一个元素作为“**基准**”（pivot）。
> 2. 遍历数组将小于“**基准**”的元素放入左边数组，将大于等于“**基准**”的元素放入右边数组。
> 3. 对“**基准**”左边和右边的两个子集不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

```JavaScript
const arr1 = [1, 4, 5, 7, 8, 6, 89, 4, 3, 2, 11, 9]

const quickSort = arr => {
    if ( toString.call(arr) !== '[object Array]' || arr.length <= 1 ) {
        return arr
    }
    const pivotIndex = Math.floor(arr.length / 2)
    const pivot = arr.splice(pivotIndex, 1)[0]
    const leftArr = []
    const rightArr = []
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            leftArr.push(arr[i])
        } else {
            rightArr.push(arr[i])
        }
    }

    // return quickSort(leftArr).concat([pivot], quickSort(rightArr))
    return [ ...quickSort(leftArr), pivot, ...quickSort(rightArr) ]
}

const res = quickSort(arr1)

console.log('quick sort result: ', res)

```

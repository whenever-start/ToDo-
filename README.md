# ToDo 便签
### dom 对象和全局变量
1. 全局
    - `todo`列表(`ul`): `todoListUl` => `.todo_list-todo`
    - `done`列表(`ul`): `doneListUl` => `.todo_list-done`
2. 生成列表后
    - todo:
        - `li`: `todoListItem` => `.todo_list-todo-item`
        - 置顶:`.placetop`
        - 标记已完成:`done`
        - 删除:`delete`
    - done:
        - 外`li`: `doneListItem` => `.todo_list-done-item`
        - `time`:`listdone-item-done`
        - 内`ul`: `doneInnerListUl` => `.listdone`
        - 内`li`: `doneInnerListItem` => `.listdone-item`
        - 撤回:`.undo`
3. 变量:
    - tabState = true
### 数据结构
```js
// let todoData = [
//     {
//         content: '提交的内容 字符串',
//         datetime: '提交的时间 字符串 格式:星期三2018-12-12',
//         state: 'todo 或 done bool',
//         istop: '是否为置顶 bool',
//         id: 'number',
//     }
// ]
{
    content: '提交的内容 字符串',
    datetime: '提交的时间 字符串 格式:星期三 2018-12-12',
    id: 'number',
}
let todoData = {
    todo:{
        istop:[],
        default:[]
    },
    done:{
        '星期三2018-12-12': [],
        '星期四2018-12-13': [],
    }
}
```
### 功能与实现
1. 初始化:
    - 从 `localStorage` 获取 todoData
        ```js
        let store = {
            get(){},
            set(){}
        }
        ```
    - 实现`todo`和`done`的界面切换功能
        ```js
        function tabTodo()
        ```
    - 根据 todoData,生成 `todo` 和 `done` 列表的内容
        ```js
        function todoRespond(){}
        function doneRespond(){}
        ```
2. 操作:置顶 标记已完成 删除 撤回
    - 置顶:
        - 将当前 `li` 插入到列表最前面
        - 为当前 `li` 添加`.top`样式
        - 将对应的`dataItem`插入到 todoData.istop 数组中
        ```js
        function itemToTop(){}
        ```
    - 标记已完成:
        - 将当前`li`从列表中删除
        - 将对应的`dataItem` 用`addToDone()`插入(unshift)到`todoData.done`对应的数组
        ```js
        function markDone(){}
        function addToDone(){}
        ```
    - 删除:
        - 删除当前`li`
        - 删除对应的`dataItem`
        ```js
        function deleteItem(){
            // 1. 通过 ele.parentNode.parentNode 找到当前 li
            // 2. 对当前 li 的 class 进行判断
                // 含有 .todo_list-todo-item,没有.top
                // 含有 .todo_list-todo-item .top
                // 含有 .listdone-item
            // 3. 针对以上3种情况,对应
                // todoData.todo.default
                // todoData.todo.top
                // todoData.done
        }
        ```
    - 撤回:
        - 将当前`li`从列表中删除
        - 将对应的`dataItem` 用`addToTodo()`插入(push)到`todoData.todo.default`中
        - 在`todo`界面生成`li`
        ```js
        function undo(){}
        function addToTodo(){}
        ```
3. 添加`todo`子项
    - 当鼠标离开焦点(`onblur`),获取输入的内容`itemContent`,时间`datetime`,生成`id`
    - 将该`dataItem`添加(push)到`todoData.todo.default`数组中
    - 插入(`appendChild`)相应的`li`
    - `input`中的内容清空
    ```js
    function addTodoItem(){}
    ```
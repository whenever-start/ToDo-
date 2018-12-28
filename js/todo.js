// 处理 localStorage
let store = {
    get(keyName){
        return JSON.parse(localStorage.getItem(keyName)) || {
            todo:{
                istop:[],
                default:[]
            },
            done:{}
        }
    },
    set(keyName,keyValue){
        return localStorage.setItem(keyName,JSON.stringify(keyValue))
    }
}
let testData = {
    todo:{
        istop:[
            {
                content: '置顶1',
                datetime:'星期二 2018-12-11',
                id:'4323466572.8281',
            },
            {
                content: '置顶2',
                datetime:'星期三 2018-12-12',
                id:'432346212.8281',
            },
            {
                content: '置顶3',
                datetime:'星期三 2018-12-12',
                id:'432423412.1234',
            },
        ],
        default:[
            {
                content: '起床',
                datetime:'星期三 2018-12-12',
                id:'457846212.1234',
            },
            {
                content: '吃饭',
                datetime:'星期三 2018-12-12',
                id:'45784645452.1234',
            },
            {
                content: '睡觉',
                datetime:'星期一 2018-12-10',
                id:'12456454512.1234',
            }
        ]
    },
    done: {
        '星期三 2018-12-12': [
            {
                content: '早读',
                datetime:'星期三 2018-12-12',
                id:'457865756712.1234',
            },
            {
                content: '上课',
                datetime:'星期三 2018-12-12',
                id:'45657645452.1234',
            },
        ],
        '星期二 2018-12-11': [
            {
                content: '放假',
                datetime:'星期三 2018-12-11',
                id:'45782323212.1234',
            },
        ],
        '星期一 2018-12-10': [
            {
                content: '旅游',
                datetime:'星期一 2018-12-10',
                id:'4578235643634523212.1234',
            },
            {
                content: '住宿',
                datetime:'星期一 2018-12-10',
                id:'45783634523212.1234',
            },
        ],
    }
}
// store.set('todoData',testData)
// 获取全局对象,设置全局变量
let todoApp = $('#todo')[0];
let todoListUl = $('.todo_list-todo')[0],
    doneListUl = $('.todo_list-done')[0];
let inputWrap = $('.todo-input')[0];
let input = $('.todo-input>input')[0];
let currentBtn = $('.todo-header-current_state')[0],
    nextBtn = $('.todo-header-next_state')[0];
let tabState = true;
// 1. 初始化
let todoData = store.get('todoData');
tabTodo();
// 界面切换
nextBtn.onclick = ()=>{
    tabTodo();
}
// 生成 todo 列表和 done 列表的内容
todoRespond();
doneRespond();
// input 添加待办子项
input.onblur = ()=>{
    addTodoItem();
}
input.onfocus = ()=>{
    todoApp.scrollTop = todoApp.scrollHeight
}



/****************************************************************************************************
 * 函数
 ***************************************************************************************************/
/**
 * 实现 todo 和 done 的界面切换功能
 */
function tabTodo(){
    currentBtn.innerHTML = tabState ? 'ToDo' : 'Done';
    nextBtn.innerHTML = !tabState ? 'ToDo' : 'Done';
    todoListUl.style.display = tabState ? 'block' : 'none';
    doneListUl.style.display = !tabState ? 'block' : 'none';
    inputWrap.style.display = tabState ? 'block' : 'none';
    tabState = !tabState;
}
/**
 * 生成 todo 列表中的内容
 */
function todoRespond(){
    todoListUl.innerHTML = '';
    todoData.todo.istop.forEach((dataItem) => {
        createTodoLi(dataItem,'top');
    });
    todoData.todo.default.forEach((dataItem) => {
        createTodoLi(dataItem,'');
    });
    // 操作:置顶
    itemToTop();
    // 标记已完成
    markDone();
    // 删除
    deleteItem();
}
/**
 * 生成 done 列表中的内容
 */
function doneRespond(){
    doneListUl.innerHTML = '';
    let arr = Object.keys(todoData.done);
    sortByDate(arr);
    if(arr === []) return;
    arr.forEach((key,i)=>{
        createLi(key);
        let doneInnerListUl = $('.todo_list-done-item>.listdone')[i];
        todoData.done[key].forEach((dataItem,j)=>{
            let li = `
                <li class="listdone-item cf" itemID=${dataItem.id}>
                    <span class="item_name">${dataItem.content}</span>
                    <div class="item_operation">
                    <span class="undo todo-common-operation_button">◀</span>
                    <span class="delete todo-common-operation_button">-</span>
                    </div>
                </li>
            `;
            doneInnerListUl.innerHTML += li;
        })
    })
    // 撤回
    undo();
    deleteItem();
    // function
    function createLi(data){
        let li = `
            <li class="todo_list-done-item">
                <time datetime="${data}" class="listdone-item-time">${data}</time>
                <ul class="listdone todo-common-list"></ul>
            </li>
        `;
        doneListUl.innerHTML += li;
    }
}
function addTodoItem(){
    if(input.value === '') return;
    // 获取 dataItem
    let dataItem = {};
    dataItem.content = input.value;
    dataItem.datetime = getDateTime(new Date());
    dataItem.id = createID();
    // 将 dataItem 添加到 todoData
    todoData.todo.default.push(dataItem);
    // input 内容清空
    input.value = '';
    // 存储到 localStorage
    store.set('todoData',todoData)
    // 在 todo 列表中插入
    todoRespond();
}
/**
 * 添加 todo 列表的 li
 * @param {object} data dataItem,拥有content,id,datetime属性
 * @param {string} cls class 字符串
 */
function createTodoLi(data,cls){
    let li = `
        <li class="todo_list-todo-item ${cls} cf" itemID=${data.id}>
            <span class="item_name">${data.content}</span>
            <div class="item_operation">
            <span class="placetop todo-common-operation_button">▲</span>
            <span class="done todo-common-operation_button">√</span>
            <span class="delete todo-common-operation_button">-</span>
            </div>
        </li>
    `;
    todoListUl.innerHTML += li;
}
/**
 * 置顶切换
 */
function itemToTop(){
    let toTopBtns = document.querySelectorAll('.todo_list-todo-item .placetop');
    toTopBtns.forEach((ele,i)=>{
        ele.onclick = ()=>{
            let currentItem = ele.parentNode.parentNode;
            if(hasClass(currentItem,'top')){
                todoData.todo.default.unshift(todoData.todo.istop[i]);
                todoData.todo.istop.splice(i,1);
            }else{
                let index = i-todoData.todo.istop.length;
                todoData.todo.istop.unshift(todoData.todo.default[index]);
                todoData.todo.default.splice(index,1);
            }
            store.set('todoData',todoData);
            todoRespond();
        }
    })
}
/**
 * 标记已完成
 * @example markDone();
 */
function markDone(){
    let markDoneBtns = document.querySelectorAll('.todo_list-todo-item .done');
    markDoneBtns.forEach((ele,i)=>{
        ele.onclick = ()=>{
            let currentItem = ele.parentNode.parentNode;
            let date,dataItem;
            let hasDifferentDateFlag = true;
            if(hasClass(currentItem,'top')){
                date = todoData.todo.istop[i].datetime
                dataItem = todoData.todo.istop[i]
                todoData.todo.istop.splice(i,1)
            }else{
                let index = i-todoData.todo.istop.length;
                date = todoData.todo.default[index].datetime
                dataItem = todoData.todo.default[index]
                todoData.todo.default.splice(index,1);
            }
            for(key in todoData.done){
                // 有相同日期的
                if(key === date){
                    todoData.done[key].push(dataItem);
                    hasDifferentDateFlag = false;
                    // break;
                }
            }
            if(hasDifferentDateFlag){
                todoData.done[date] = [dataItem];
                // hasDifferentDateFlag = true;
            }
            store.set('todoData',todoData);
            todoRespond();
            doneRespond();
        }
    })
}
/**
 * 从已完成撤回成待完成,从 done 撤回到 default 数组中
 * @example undo();
 */
function undo(){
    let undoBtns = document.querySelectorAll('.todo_list-done-item .undo');
    undoBtns.forEach(ele=>{
        ele.onclick = ()=>{
            let currentItem = ele.parentNode.parentNode;
            let id = currentItem.getAttribute('itemid');
            for(key in todoData.done){
                // map 和 forEach 不能正常跳出循环,改用for
                for(let i=0;i<todoData.done[key].length;i++){
                    let dataItem = todoData.done[key][i];
                    if(id === dataItem.id){
                        todoData.todo.default.push(dataItem); // 将当前点击的 dataItem 添加到default 数组中
                        todoData.done[key].splice(i,1); // 从 done[key] 数组中删除该数据
                        break;
                    }
                }
                if(todoData.done[key].length === 0) delete todoData.done[key];
            }
            store.set('todoData',todoData);
            doneRespond();
            todoRespond();
        }
    })
}
function deleteItem(){
    let deleteBtns = document.querySelectorAll('.todo-body .delete');
    deleteBtns.forEach(ele=>{
        ele.onclick = ()=>{
            let currentItem = ele.parentNode.parentNode;
            let id = currentItem.getAttribute('itemid');
            if(hasClass(currentItem,'todo_list-todo-item')){// istop || default
                let dataArr = hasClass(currentItem,'top') ? todoData.todo.istop :todoData.todo.default;
                for(let i=0;i<dataArr.length;i++){
                    console.log('true?:',dataArr[i].id === id)
                    if(dataArr[i].id === id){
                        console.log('in')
                        dataArr.splice(i,1);
                        break;
                    }
                }
                store.set('todoData',todoData);
                todoRespond();
                doneRespond();
            }else{ // done (.listdone-item)
                for(key in todoData.done){
                    let dataArr = todoData.done[key];
                    for(let i=0;i<dataArr.length;i++){
                        if(dataArr[i].id === id){
                            dataArr.splice(i,1);
                            break;
                        }
                    }
                    if(todoData.done[key].length === 0) delete todoData.done[key];
                    store.set('todoData',todoData);
                    doneRespond();
                    todoRespond();
                }
            }
        }

    })
}


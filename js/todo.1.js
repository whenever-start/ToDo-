/**
 * 数据
 */
// let todoData = [
//     {
//         title:'每天8点起床',
//         datetime:'星期三2018-12-12',
//         state:true,
//     },
//     {
//         title:'跑步',
//         datetime:'星期三2018-12-12',
//         state:true,
//     },
//     {
//         title:'0',
//         datetime:'星期三2018-12-12',
//         state:false,
//     },
//     {
//         title:'1',
//         datetime:'星期三2018-12-12',
//         state:false,
//     },
//     {
//         title:'2',
//         datetime:'星期三2018-12-12',
//         state:false,
//     },
// ]
/**
 * 功能:
 * 1. 显示
 *  读取 loacalStorage 中的数据: todoData
 *  响应数据,生成html内容
 * 2. 编辑 todo
 *  获取 input 输入内容,转换成 json 格式存储到 localStorage
 *  响应数据,生成html内容
 * 3. 操作:置顶 标记已完成 删除 撤回
 *  todo:
 *      置顶:
 *          获取当前 li 的 listID,通过 listID 获取 todoData 中对应的子项(getDataItem(index)),将该子项的副本 unshift() 到最前,并删除该子项
 *          响应数据,生成内容
 *      标记已完成:
 *          获取当前 li 的 listID,通过 listID 获取 todoData 中对应的子项,将 state 属性设置为 !state
 *          响应数据
 *      删除:
 *          获取当前 li 的 listID,通过 listID 获取 todoData 中对应的子项,将该子项从数组中删除
 *          响应数据
 *  done:
 *      撤回:
 *          获取当前 li 的 listID,通过 listID 获取 todoData 中对应的子项,将 state 属性设置为 !state
 *          响应数据
 *     删除:
 *          获取当前 li 的 listID,通过 listID 获取 todoData 中对应的子项,将该子项从数组中删除
 *          响应数据
 *          
 */
window.onload = ()=>{
    // 在 head 标签中添加 style 标签,以便修改伪元素的样式
    let style = document.createElement('style')
    document.head.appendChild(style)
    let todo = document.querySelector('#todo')
    todoRespond(todo)
    
    function todoRespond(node){
        /**
         * 获取元素
         */
        let currentStateNode = node.querySelector('.todo-header-current_state'),
            nextStateNode = node.querySelector('.todo-header-next_state'),
            todoList = node.querySelector('.todo_list-todo'),
            doneList = node.querySelector('.todo_list-done'),
            todoInput = node.querySelector('.todo-input')
            
        let input = node.querySelector('.todo-input>input')
        node.tabState = true
        // 读取 localStorage 中的 todoData
        let todoData = JSON.parse(localStorage.getItem('todoData')) || []
        // 显示 初始化
        listRespond(todoData)
        // 编辑 todo
        addTodoItem();
        // header 中 todo 和 done 菜单的切换
        todotab(node.tabState) // 初始化
        nextStateNode.onclick = ()=>{
            node.tabState = !node.tabState
            todotab(node.tabState)
        }
                
        function swapItemState(id){
            todoData.forEach((dataItem,i)=>{
                if(id == dataItem.id){
                    dataItem.state = !dataItem.state
                    dataItem.istop = false
                    localStorage.setItem('todoData',JSON.stringify(todoData))
                }
            })
        }
        function placeTop(id){
            todoData.forEach((dataItem,i)=>{
                if(id == dataItem.id){
                    dataItem.istop = !dataItem.istop
                    if(!dataItem.istop) return
                    let item = dataItem
                    todoData.splice(i,1)
                    todoData.unshift(item)
                    localStorage.setItem('todoData',JSON.stringify(todoData))
                }
            })
        }
        function addTodoItem(){
            input.onblur = ()=>{
                let dataItem = {}
                console.log('input:',input.value)
                if(input.value){
                    dataItem.title = input.value
                    dataItem.datetime = transformDatetime()
                    dataItem.state = true
                    dataItem.istop =false
                    dataItem.id = createID()
                    todoData.push(dataItem)
                }
                localStorage.setItem('todoData',JSON.stringify(todoData))
                // todoData.push(JSON.parse(localStorage.getItem('todoData')))
                listRespond(todoData)
                input.innerHTML = ''
            }
        }
        /**
         * 
         * @param {bool} state tabState 
         */
        function todotab(state){
            currentStateNode.innerHTML = state ? 'Todo' : 'Done'
            nextStateNode.innerHTML = state ? 'Done' : 'Todo'
            todoList.style.display = state ? 'block' : 'none'
            todoInput.style.display = state ? 'block' : 'none'
            doneList.style.display = !state ? 'block' : 'none'
        }
        function listRespond(data){
            if(!data) return
            let todoLen = 0,doneLen = 0
            todoList.innerHTML = ''
            doneList.innerHTML = ''
            data.forEach((item,i) => {
                let todoItem = `
                    <li class="todo_list-todo-item cf"  itemID=${item.id}>
                    <span class="item_name">${item.title}</span>
                    <div class="item_operation">
                    <span class="placetop todo-common-operation_button">▲</span>
                    <span class="done todo-common-operation_button">√</span>
                    <span class="delete todo-common-operation_button">-</span>
                    </div>
                    </li>
                `
                let doneItem = `
                    <li class="todo_list-done-item"  itemID=${item.id}>
                    <time datetime="${item.datetime}" class="listdone-item-time">${item.datetime}</time>
                    <ul class="listdone todo-common-list">
                    <li class="listdone-item cf">
                    <span class="item_name">${item.title}</span>
                    <div class="item_operation">
                    <span class="undo todo-common-operation_button">◀</span>
                    <span class="delete todo-common-operation_button">-</span>
                    </div>
                    </li>
                    </ul>
                    </li>
                `
                if(item.state){ // todo
                    todoList.innerHTML += todoItem
                }else{ // done
                    doneList.innerHTML += doneItem
                }
            });
            let todo_doneBtns = node.querySelectorAll('.todo_list-todo-item .item_operation>.done'),
                todo_placeTopBtns = node.querySelectorAll('.todo_list-todo-item .item_operation>.placetop'),
                todo_deleteBtns = node.querySelectorAll('.todo_list-todo-item .item_operation>.delete'),
                done_undoBtns = node.querySelectorAll('.listdone-item .undo')
            let todoListItems = node.querySelectorAll('.todo_list-todo-item'), // li
                doneListItems = node.querySelectorAll('.todo_list-done-item') // li
            // 置顶 li 的样式改变
            todoListItems.forEach((ele,i)=>{
                let id = ele.getAttribute('itemID')
                data.forEach((item,j)=>{
                    if(id == item.id){
                        if(item.istop){
                            ele.style.color = '#e7731a'
                            // style.innerHTML = `.todo-common-list>li:nth-child(${i}):before{background: #e7731a}`
                        }else{
                            ele.style.color = '#fff'
                            // style.innerHTML = `.todo-common-list>li:nth-child(${i}):before{background: #fff}`
                        }

                    }
                })
            })
            /**
             * 操作:置顶 标记已完成 删除 撤回
             */
            // 置顶
            todo_placeTopBtns.forEach((ele,i)=>{
                let id = todoListItems[i].getAttribute('itemID')
                ele.onclick = ()=>{
                    placeTop(id)
                    listRespond(todoData)
                }
            })
            // 标记已完成
            todo_doneBtns.forEach((ele,i) => {
                ele.onclick = ()=>{
                    let id = todoListItems[i].getAttribute('itemID')
                    swapItemState(id)
                    listRespond(todoData)
                }
            });
            // 撤回 undo
            done_undoBtns.forEach((ele,i) => {
                ele.onclick = ()=>{
                    let id = doneListItems[i].getAttribute('itemID')
                    swapItemState(id)
                    listRespond(todoData)
                }
            })
        }
        
    }
    
    
/*************************************************************************
* 函数
*************************************************************************/
/**
 * 
 * @param {obj} parent 目标元素
 * @param  {...any} rest 要插入目标元素的标签,如 'div' 'span',{字符串}
 * @example insertItem(app,')
 * 输入:insertItem(app,'ul','li','div','span')
 * 输出:
 * <div class="app">
 *     <ul>
 *         <li>
 *             <span></span>
 *         </li>
 *     </ul>
 * </div>
 */
function insertItem(parent,...rest){
    let len = rest.length
    let item = document.createElement(rest[len-1]);
    for(let i=len-2;i>-1;i--){
        let element = document.createElement(rest[i])
        element.appendChild(item)
        item = element
    }
    parent.appendChild(item)
}
// 返回时间格式,如:"星期二 2018-12-25"
function transformDatetime(){
    let d = new Date()
    let day = transformDay(d.getDay()),
        year = d.getFullYear(),
        mon = d.getMonth() + 1,
        date = d.getDate();
    return `${day} ${year}-${mon}-${date}`
}
function transformDay(day){
    switch(day){
        case 0: return '星期天'
        case 1: return '星期一'
        case 2: return '星期二'
        case 3: return '星期三'
        case 4: return '星期四'
        case 5: return '星期五'
        case 6: return '星期六'
    }
}
/**
 * 返回一个 ID 数字,如:1545696000000.1294
 */
function createID(){
    let d = new Date()
    let id = Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) + Math.random()
    return id
}

}
/**
 * @returns 日期格式:"星期二 2018-12-25"
 */
function getDateTime(newDate){
    let day = transformDayFormat(newDate.getDay()),
        year = newDate.getFullYear(),
        mon = newDate.getMonth() + 1,
        date = newDate.getDate();
    return `${day} ${year}-${mon}-${date}`
}
/**
 * 
 * @param {number} day 数字0-6
 */
function transformDayFormat(day){
    switch(day){
        case 0: return '星期天';
        case 1: return '星期一';
        case 2: return '星期二';
        case 3: return '星期三';
        case 4: return '星期四';
        case 5: return '星期五';
        case 6: return '星期六';
        default:throw `${day} is not in 0-6`;
    }
}
/**
 * 返回一个 ID 数字,如:1545696000000.1294
 */
function createID(){
    let d = new Date()
    let id = Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()) + Math.random()
    return String(id)
}
/**
 * 判断传入的元素是否含有指定的 class,如果有则返回 true
 * @param {Object} ele 传入的元素
 * @param {string} cls 指定的 class 字符串
 */
function hasClass(ele,cls){
    let reg = new RegExp(cls);
    let eleCls = ele.getAttribute('class');
    return reg.test(eleCls);
}
/**
 * 对传入的日期数组,如["星期三 2018-12-12", "星期二 2018-12-11", "星期一 2018-12-10", "星期五 2018-12-28"]
 * 进行排序
 * @param {Array} arr 传入的数组
 */
function sortByDate(arr){
    arr.forEach((str,i)=>{
        let dateArr = str.match(/[0-9\+]+/g)
        arr[i] = new Date(parseInt(dateArr[0]),parseInt(dateArr[1])-1,parseInt(dateArr[2]))
    })
    arr.sort((a,b)=>{
        return a<b ? 1 : -1
    })
    arr.forEach((v,i)=>{
        arr[i] = getDateTime(v)
    })
    return arr;
}
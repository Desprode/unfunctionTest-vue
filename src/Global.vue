<script>
import axios from 'axios'

/** 日期格式化 */
function formatDate(date, fmt) {
    // console.log('now in formatDate, with date is ', date)
    let o = {
        'M+': date.getMonth() + 1,  // 月份
        'd+': date.getDate(),       // 日
        'h+': date.getHours(),      // 小时
        'm+': date.getMinutes(),    // 分
        's+': date.getSeconds(),    // 秒
        'S': date.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }

    return fmt
}

/** 获取cookie
  * name:cookie中的key值*/
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return arr[2];
    else
        return null;
}

// /** 获取用户权限列表 */
// function getUserPerms(username){
//     let _this = this;
//     // let resp = new Map();
//     let resp = {};
    
//     axios.post('/myapi/user/getUserPermissions', {
//         userId: username,
//     }).then(function (response) {
//         if (response.data.result == "fail") {
//             resp = {'result': 'fail'};
//             // resp.set('result', 'fail');
//         } else if (response.data.result == "ok") {
//             // console.log("get user permissions: ", response);
//             let results = response.data.resultList;
//             // console.log("results: ", results);

//             _this.userPermissions = [];
//             // console.log("userPermissions before: ", _this.userPermissions);
//             for (let perm in results) {
//                 // console.log("perm: ", results[perm].name);
//                 _this.userPermissions.push(results[perm].name);
//             } 
//             // console.log("userPermissions after: ", _this.userPermissions);

//             resp = {'result': 'ok', 'perms': _this.userPermissions};
//             // resp.set('result', 'ok');
//             // resp.set('perms', _this.userPermissions);
//         }

//         console.log('--- resp: --- ', resp);
//     })
    
//     console.log('=== resp: === ', resp);
//     console.log('resp.result: ', resp.result);
//     console.log('resp["result"]: ', resp["result"]);

//     return resp
// }

export default {
    // 用户权限
    userPermissions: [], 

    // 任务状态
    taskStatusList: [
        {value: '00', label: '新建'},
        {value: '01', label: '进行中'},
        {value: '02', label: '已完成'},
        {value: '03', label: '延迟'},
        {value: '10', label: '已取消'}
    ],
    taskStatusMap: {'00':'新建', '01':'进行中', '02':'已完成', '03':'延迟', '10':'已取消'}, 

    // 任务来源
    taskSourceList: [{value: '1', label: 'ICDP任务'}, {value: '2', label: '自建任务'}], 
    taskSourceMap: {'1':'ICDP任务', '2':'自建任务'},

    // 需求类型
    demandTypeList: [
        {value: '01', label: '单交易测试'}, 
        {value: '02', label: '容量测试'}, 
        {value: '03', label: '稳定性测试'}, 
        {value: '04', label: '其他测试'}, 
    ], 
    demandTypeMap: {'01': '单交易测试', '02': '容量测试', '03': '稳定性测试', '04': '其他测试'}, 
    
    //机器管理类型
    machineTypeStatus: {'1':'http', '2':'tuxedo', '3':'java'},
    
    //执行状态
    exeStatusList: [
        {value: '00', label: '执行异常'},
        {value: '10', label: '执行成功'},
        {value: '11', label: '执行停止'},
    ],
    exeStatusMap: {'00':'执行异常', '10':'执行成功', '11':'执行停止'}, 
    
    //平台日志
    detailsStepMap:{'machine':'机器申请','jmeter':'开始启动jmeter','split':'开始文件拆分','machinecalc':'开始资源计算','plugin':'开始plugin','monitor':'开始monitor'},
    
    detailsMap: {'COMPLETED':'完成', 'FAILED':'失败'}, 

    //场景管理，场景类型
    senarioType:{'01':'单交易基准','02':'单交易负载','03':'混合场景'}, 

    // 日期格式化函数
    formatDate, 

    // 获取cookie中的值
    getCookie,
    
    // // 获取用户权限列表
    // getUserPerms, 
}
</script>
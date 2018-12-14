<script>
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

export default {
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
    
    //执行状态
    exeStatusList: [
        {value: '00', label: '执行完成'},
        {value: '10', label: '执行异常'},
        {value: '11', label: '执行停止'},
    ],
    exeStatusMap: {'00':'执行完成', '10':'执行异常', '11':'执行停止'}, 
    
    //场景管理，场景类型
    senarioType:{'01':'单交易基准','02':'单交易负载','03':'混合场景'}, 

    // 日期格式化函数
    formatDate
}
</script>
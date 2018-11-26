<script>
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
    taskSourceList: [{value: '1', label: '开发任务'}, {value: '2', label: '自建'}], 
    taskSourceMap: {'1':'开发任务', '2':'自建'},
    //执行状态
    exeStatusList: [
        {value: '00', label: '执行完成'},
        {value: '10', label: '执行异常'},
        {value: '11', label: '执行停止'},
    ],
    exeStatusMap: {'00':'执行完成', '10':'执行异常', '11':'执行停止'}, 
}
</script>
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
    //场景类型
    senarioType:{'01':'单交易基准','02':'单交易负载','03':'混合场景'}
}
</script>
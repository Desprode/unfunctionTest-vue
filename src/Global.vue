<script>
export default {
    taskStatusList: [
        {
            value: '00',
            label: '新建'
        },
        {
            value: '01',
            label: '进行中'
        },
        {
            value: '02',
            label: '已完成'
        },
        {
            value: '03',
            label: '延迟'
        },
        {
            value: '10',
            label: '已取消'
        }
    ],
    taskStatusMap: {'00':'新建', '01':'进行中', '02':'已完成', '03':'延迟', '10':'已取消'}, 
}
</script>
<template>
    <div>
        <Card style="height:500px">
            <Form :label-width="50">
                <Row>
                    <Col span="7">
                        <FormItem label="服务器">
                            <Select v-model="model" multiple>
                                <OptionGroup v-for="(item,index) in subsys" :label="item.name" :key="index">
                                    <Option v-for="itemOption in subsys[index].ip" :value="itemOption" :key="itemOption" placeholder="Select IP List">{{itemOption}}</Option>
                                </OptionGroup>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="7">
                        <FormItem label="CPU">
                            <Select multiple>
                                <Option placeholder="Select CPU Mode" v-for="item in CPU" :value="item.label" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="7">
                        <FormItem label="内存">
                            <Select multiple>
                                <Option placeholder="Select Memory Mode" v-for="item in Memory" :value="item.label" :key="item.value">{{item.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="3">
                         <Button @click="confirm" type="primary">确定</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Cascader :data="CPUData" v-model="value1" multiple></Cascader>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    export default {
        data (){
            return {
                model:'',
                CPU:[
                    {
                        value:'users',
                        label:'users'
                    },
                    {
                        value:'sys',
                        label:'sys'
                    },
                    {
                        value:'wait',
                        label:'wait'
                    },
                ],
                Memory:[
                    {
                        value:'buffer',
                        label:'buffer'
                    },
                    {
                        value:'cache',
                        label:'cache'
                    }
                ],
                subsys:[
						{
						"name":"分类一",
						"ip":["128.196.52.134","128.196.52.135","128.196.52.136"]
						},
						{
						"name":"分类二",
						"ip":["128.196.53.145","128.196.53.146","128.196.53.147"]
						},
						{
						"name":"分类三",
						"ip":["128.196.53.148","128.196.52.124","128.196.52.132","128.196.52.133"]
						}
					],
                value1:[],
                CPUData:[
                    {
						label:"分类一",
                        checked:true,
						children:[{label:"128.196.52.134",checked:true},{label:"128.196.52.135",checked:true},{label:"128.196.52.136",checked:true}]
					},
					{
						label:"分类二",
						children:[{label:"128.196.53.145"},{label:"128.196.53.146"},{label:"128.196.53.147"}]
					},
					{
						label:"分类三",
						children:[{label:"128.196.53.148"},{label:"128.196.52.124"},{label:"128.196.52.132"},{label:"128.196.52.133"}]
					}
                ],

            }
        },
        methods: {
            confirm:function(){
                for(var i=0;i<this.subsys.length;i++){
                    console.log(this.subsys[i].name);
                    for(var j=0;j<this.subsys[i].ip.length;j++){
                        console.log(this.subsys[i].ip[j]);
                    }
                }
                console.log(this.model);
            },
        }
    }
</script>
<style scoped>
</style>
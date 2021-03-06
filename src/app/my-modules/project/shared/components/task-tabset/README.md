### 共用组件

项目的任务的自动分类，根据角色，变更操作

### 数据流入

1.  若传入`project`,则根据`project`的 ID 去获得所属的任务，从第一个`dataDrive`组件去获取数据，然后分类，最后更新对应的`dataDrive`组件，入口方法`getDataDriveSub`
2.  若没有传入`project`，而是传入任务列表的订阅者,则订阅并更新第一个`dataDrive`组件，后面逻辑与上一个情况一致。

### 数据监听

1.  Input 属性`afterDataChange`,对任务有 update 操作后会运行此 function。

### 分类说明

1.  状态是`open`，当前时间比任务的`DUE_DATE`晚的话是超期；
2.  接上，然后没有`ASSIGNEE`的为未分配；
3.  接上，其它是进行中；
4.  状态是`Finished`,是待审核；
5.  状态是`Closed`，是已结案。

### 角色管控

1.  若传入`project`, 根据`project`的`OWNER`是否与当前用户的工号一致,一致则可进行所有操作，否则只能查看任务详情。

2.  若没有传入`project`，而是传入任务列表的订阅者,则默认是负责人，进行所有操作。

### 任务操作说明

1.  状态是`open`的可以修改及删除；
2.  状态是`Finished`可退回或者结案；

### 其它

责任人的修改,需要是任务所属项目的组员,所以需要对员工搜索组件进行过滤，比较快的方法是直接传入`projectPeople`人员表, 否则则根据关系去数据库获取人员表再过滤。

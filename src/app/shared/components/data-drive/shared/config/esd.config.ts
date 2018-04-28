export const esdConfig = {
  id: 7,
  APIs: { search: 'ESD/GetNotThrough?chu_deptno={chu_deptno}' },
  additionalFn: {
    filterColumn: true,
    fullScreen: true,
    changeBodyFontSize: true,
    changeHeaderFontSize: true,
    menu: true,
    toExcel: true,
  },
  dataViewSet: {
    title: '門禁狀況看板',
    more: {
      pageSet: { enable: false },
      border_y: { enable: false },
      header: {
        textColor: '#fff',
        bgColor: '#000',
        textSize: '1.8rem',
      },
      body: {
        textColor: 'red',
        bgColor: '#000',
        textSize: '1.8rem',
        rules: [
          {
            matches: [['LOT_NO', 'required'], ['IQC_FINISHED_TIME', 'isNull']],
            textColor: 'yellow',
          },
          {
            matches: [['LOT_NO', 'required']],
            textColor: 'green',
          },
        ],
      },
      fixedHeader: {
        enable: true,
        scrollHeight: 'auto',
        autoScroll: {
          interval: 2000,
          loop: true,
        },
      },
    },
  },
  tableData: {
    columns: [
      {
        property: 'EMPNO',
        value: '工號',
      },
      {
        property: 'NAME',
        value: '姓名',
      },
      {
        property: 'BU_NAME',
        value: '部門名稱',
      },
      {
        property: 'BOSS',
        value: '主管名',
      },
    ],
  },
};

export const inspectionLineConfig = {
  id: 9,
  APIs: {
    search:
      'IPQA/tracProblems?nameID={nameID}&dateFM={dateFM}&dateTO={dateTO}&company_name={company_name}&type={type}&status={status}',
    update: 'IPQA/UpdateReportLines',
  },
  additionalFn: {
    filterColumn: true,
    changeBodyFontSize: true,
    changeHeaderFontSize: true,
    menu: true,
    toExcel: true,
  },
  dataViewSet: {
    title: '問題列表',
    more: {
      showAction: true,
    },
  },
  updateSets: [
    {
      property: 'LINE_ID',
      InputOpts: {
        type: 'primary',
        default: 0,
      },
    },
    {
      property: 'OWNER_EMPNO',
      InputOpts: {
        type: 'colleagueSearcher',
      },
    },
    {
      property: 'PROBLEM_STATUS',
      InputOpts: {
        type: 'select',
        placeHolder: '請選擇類別',
        match: {
          fns: [{ name: 'required' }],
          err: '不能為空',
        },
        more: {
          options: [
            { property: 'New', value: '待分配' },
            { property: 'Waiting', value: '待處理' },
            { property: 'Done', value: '已處理' },
            { property: 'HighLight', value: 'HighLight' },
          ],
        },
      },
    },
  ],
  searchSets: [
    {
      property: '巡檢名稱',
      apiProperty: 'nameID',
      InputOpts: {
        type: 'select',
        placeHolder: '請選擇類別',
        more: {
          lazyAPI: 'IPQA/GetMRIName?company_name={company_name}&type=boss',
          lazyParams: ['NAME_ID', 'INSPECT_NAME'],
          lazyAPIUserMes: {
            company_name: 'COMPANY_ID',
          },
        },
      },
    },
    {
      property: '問題狀態',
      apiProperty: 'status',
      InputOpts: {
        type: 'select',
        placeHolder: '問題狀態',
        more: {
          options: [
            { property: 'New', value: '待分配' },
            { property: 'Waiting', value: '待處理' },
            { property: 'Done', value: '已處理' },
            { property: 'HighLight', value: 'HighLight' },
          ],
        },
      },
    },
    {
      property: '開始時間',
      apiProperty: 'dateFM',
      InputOpts: {
        type: 'datePicker',
      },
    },
    {
      property: '結束時間',
      apiProperty: 'dateTO',
      InputOpts: {
        type: 'datePicker',
      },
    },
  ],
  tableData: {
    searchable: true,
    editable: true,
    isCompanyLimited: 'company_name',
    defaultSearchParams: {
      type: 'boss',
    },
    columns: [
      {
        property: 'PROBLEM_DESC',
        value: '問題描述',
      },
      {
        property: 'LOCATION',
        value: '地點',
      },
      {
        property: 'PROBLEM_TYPE',
        value: '問題分類',
      },
      {
        property: 'PROBLEM_STATUS',
        value: '問題狀態',
        more: {
          pipe: {
            name: 'replace',
            params: [
              {
                New: '待分配',
                Waiting: '待處理',
                Done: '已處理',
              },
            ],
          },
        },
      },
      {
        property: 'PROBLEM_PICTURES',
        value: '問題附圖',
        more: {
          type: {
            name: 'img',
          },
        },
      },
      {
        property: 'OWNER_EMPNO',
        value: '處理人',
      },
      {
        property: 'ACTION_DESC',
        value: '問題原因',
      },
      {
        property: 'ACTION_STATUS',
        value: '糾正措施',
      },
      {
        property: 'ACTION_PICTURES',
        value: '措施附圖',
        more: {
          type: {
            name: 'img',
          },
        },
      },
      {
        property: 'ACTION_DATE',
        value: '措施導入日期',
        more: {
          pipe: {
            name: 'date',
            params: ['YYYY/MM/DD'],
          },
          sortBy: {
            name: 'date',
          },
        },
      },
      {
        property: 'INSPECTOR_NAME',
        value: '巡檢人員',
      },
      {
        property: 'INSPECT_DATE',
        value: '巡檢日期',
        more: {
          pipe: {
            name: 'date',
            params: ['YYYY/MM/DD'],
          },
          sortBy: {
            name: 'date',
          },
        },
      },
      {
        property: 'INSPECT_TIME',
        value: '巡檢時間',
        more: {
          sortBy: {
            name: 'byTime',
          },
        },
      },
    ],
  },
};

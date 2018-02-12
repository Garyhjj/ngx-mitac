export const inspectionAttendanceConfig = {
    id: 12,
    APIs: { 
        search: 'IPQA/attendanceInfo?nameID={nameID}&dateFM={dateFM}&dateTO={dateTO}&type={type}',
     },
    additionalFn: {
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true
    },
    dataViewSet: {
        title: '考勤記錄',
    },
    searchSets: [
        {
            property: '巡檢名稱',
            apiProperty: 'nameID',
            InputOpts: {
                type: 'select',
                placeHolder: '請選擇類別',
                default: 3,
                more: {
                    lazyAPI: 'IPQA/GetMRIName?company_name={company_name}&type=boss',
                    lazyParams: ['NAME_ID', 'INSPECT_NAME'],
                    lazyAPIUserMes: {
                        company_name: 'COMPANY_ID'
                    }
                }
            }
        },
        {
            property: '考勤狀況',
            apiProperty: 'type',
            InputOpts: {
                type: 'select',
                placeHolder: '請選擇考勤狀況',
                more: {
                    options:  [{ property: 1, value: '未刷卡' }, { property: 2, value: '未產生補休' }
                    , { property: 3, value: '已產生補休' }]
                }
            }
        },
        {
            property: '開始時間',
            apiProperty: 'dateFM',
            InputOpts: {
                type: 'datePicker',
            }
        },
        {
            property: '結束時間',
            apiProperty: 'dateTO',
            InputOpts: {
                type: 'datePicker',
            }
        }
    ],
    tableData: {
        searchable: true,
        defaultSearchParams: {
            nameID: 3
        },
        columns: [
            {
                property: 'SCHEDULE_DATE', value: '巡檢日期'
            },
            {
                property: 'NAME', value: '巡檢人員'
            },
            {
                property: 'ACUTAL_FROM_TIME', value: '開始時間'
            },
            {
                property: 'ACTUAL_TO_TIME', value: '結束時間'
            },
            {
                property: 'ACTUAL_HOURS', value: '補休時數'
            }
        ]
    }
}
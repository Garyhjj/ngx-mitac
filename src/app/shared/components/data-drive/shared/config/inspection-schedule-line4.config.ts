export const inspectionScheduleLine4Config = {
    id: 13,
    APIs: { 
        search: 'IPQA/GetScheduleList?nameID=4&dateFM={dateFM}&dateTO={dateTO}&week={week}',
     },
    additionalFn: {
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true
    },
    dataViewSet: {
        title: '排班記錄',
    },
    searchSets: [
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
        columns: [
            {
                property: 'SCHEDULE_NAME', value: '巡檢週次'
            },
            {
                property: 'AREA', value: '巡檢區域'
            },
            {
                property: 'NAME', value: '巡檢人員'
            },
            {
                property: 'FROM_DATE', value: '開始日期'
            },
            {
                property: 'FROM_TIME', value: '開始時間'
            },
            {
                property: 'TO_DATE', value: '結束日期'
            },
            {
                property: 'TO_TIME', value: '結束時間'
            }
        ]
    }
}
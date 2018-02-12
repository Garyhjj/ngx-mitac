export const inspectionScheduleLineConfig = {
    id: 12,
    APIs: { 
        search: 'IPQA/GetScheduleList?nameID={nameID}&dateFM={dateFM}&dateTO={dateTO}&week={week}',
     },
    additionalFn: {
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true,
        addItem: true
    },
    dataViewSet: {
        title: '排班記錄',
        more: {
            showAction: true
        }
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
        addable: true,
        deletable: true,
        editable: true,
        columns: [
            {
                property: 'SCHEDULE_DATE', value: '巡檢日期'
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
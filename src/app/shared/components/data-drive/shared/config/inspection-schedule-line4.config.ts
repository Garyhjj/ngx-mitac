export const inspectionScheduleLine4Config = {
    id: 13,
    APIs: { 
        search: 'IPQA/GetScheduleList?nameID=4&dateFM={dateFM}&dateTO={dateTO}&week={week}',
        delete: 'IPQA/DeleteScheduleHeader?sechedule_header_id={SCHEDULE_HEADER_ID}'
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
            property: '巡檢週次',
            apiProperty: 'week',
            InputOpts: {
                type: 'select',
                more: {
                    lazyAPI: 'IPQA/GetMRIWeek?bweek=3&eweek=8',
                    lazyParams: ['WEEK_ID', 'WEEK_DESC']
                }
            }
        },
    ],
    tableData: {
        searchable: true,
        addable: true,
        deletable: true,
        editable: true,
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
                property: 'FROM_DATE', value: '開始日期', more: {
                    sortBy: {
                        name: 'byTime'
                    }
                }
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
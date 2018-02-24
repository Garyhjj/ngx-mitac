export const inspectionCommentConfig = {
    id: 14,
    APIs: { 
        search: 'IPQA/commentInfo?nameID=3&dateFM={dateFM}&dateTO={dateTO}&type={type}',
    },
    additionalFn: {
        filterColumn: true,
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true
    },
    dataViewSet: {
        title: '巡檢報告列表',
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
        },
        {
            property: '狀態',
            apiProperty: 'type',
            InputOpts: {
                type: 'select',
                placeHolder: '狀態',
                more: {
                    options: [{ property: 0, value: '未評分' }, { property: 1, value: '已評分' }]
                }
            }
        },
    ],
    tableData: {
        searchable: true,
        columns: [
            {
                property: 'NAME', value: '姓名'
            },
            {
                property: 'SCHEDULE_DATE', value: '巡檢時間'
            },
            {
                property: 'ADDITIONAL_SCORE', value: '附加分'
            },
            {
                property: 'SCORE', value: '總分'
            }
        ]
    }
}
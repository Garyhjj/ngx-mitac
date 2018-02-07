export const esdConfig = {
    id: 7,
    APIs: { search: 'GetNotThrough?chu_deptno={chu_deptno}' },
    additionalFn: {
        filterColumn: true,
        fullScreen: true,
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true
    },
    dataViewSet: {
        title: '門禁狀況看板',
        more: {
            pageSet: { enable: false },
            border_y: { enable: false },
            header: {
                textColor: '#fff',
                bgColor: '#000',
                textSize: '1.8rem'
            },
            body: {
                textColor: 'red',
                bgColor: '#000',
                textSize: '1.8rem',
                rules: [
                    {
                        matches: [['LOT_NO', '\\w+'], ['IQC_FINISHED_TIME', '^\\s*$']],
                        textColor: 'yellow',
                    },
                    {
                        matches: [['LOT_NO', '\\w+']],
                        textColor: 'green',
                    }
                ]
            },
            fixedHeader: {
                enable: true,
                scrollHeight: 'auto',
                autoScroll: {
                    interval: 2000,
                    loop: true
                }
            },
        }
    },
    tableData: {
        columns: [
            {
                property: 'LOT_NO', value: 'LOT_NO'
            },
            {
                property: 'CONTAINER_NO', value: '進口柜號'
            },
            {
                property: 'CUSTOMS_TIME', value: '報關時間'
            },
            {
                property: 'ATA_MSL_TIME', value: '回廠時間'
            },
            {
                property: 'WO_NO', value: '工單'
            },
            {
                property: 'PART_NO', value: '料號'
            },
            {
                property: 'SHORTAGE_QUANTITY', value: '數量'
            },
            {
                property: 'SIC_NAME', value: '對應庫別'
            },
            {
                property: 'RECEIVE_TIME', value: '收料時間'
            },
            {
                property: 'IQC_TIME', value: '送檢時間'
            },
            {
                property: 'INPUT_DATE', value: '緊急時間'
            },
            {
                property: 'IQC_FINISHED_TIME', value: '送檢完成時間'
            }
        ]
    }
}
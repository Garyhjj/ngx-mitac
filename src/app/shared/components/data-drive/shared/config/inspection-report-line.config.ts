export const inspectionReportLineConfig = {
    id: 10,
    APIs: { 
        search: 'IPQA/reportLines?header_id={header_id}',
        update: 'IPQA/UpdateReportLines',
        delete: 'IPQA/DeleteReportLines?line_id={LINE_ID}'
     },
    additionalFn: {
        filterColumn: true,
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true,
        addItem: true
    },
    dataViewSet: {
        title: '問題列表',
        more: {
            showAction: true
        }
    },
    updateSets: [
        {
            property: 'LINE_ID',
            InputOpts: {
                type: 'primary',
                default: 0
            }
        },
        {
            property: 'INSPECT_TIME',
            InputOpts: {
                type: 'timePicker',
                more: {
                    pickerFormat: 'HH:mm',
                    showFormat: 'HH:mm'
                }
            }
        },
        {
            property: 'LOCATION',
        },
        {
            property: 'PROBLEM_FLAG',
            InputOpts: {
                type: 'switch',
            }
        },
        {
            property: 'PROBLEM_TYPE',
            InputOpts: {
                type: 'select',
                placeHolder: '請選擇類別',
                more: {
                    options:  [{ property: '安全問題', value: '安全問題' }, { property: '員工違紀問題', value: '員工違紀問題' }
                    , { property: '其他7S問題', value: '其他7S問題' }]
                }
            }
        },
        {
            property: 'PROBLEM_DESC',
            InputOpts: {
                type: 'textarea'
            }
        },
        {
            property: 'PROBLEM_PICTURES',
            InputOpts: {
                type: 'photoUpload'
            }
        },
        {
            property: 'OWNER_EMPNO',
            InputOpts: {
                type: 'colleagueSearcher'
            }
        },
    ],
    tableData: {
        searchable: true,
        editable: true,
        addable: true,
        deletable: true,
        defaultSearchParams: {
           
        },
        columns: [
            {
                property: 'PROBLEM_DESC', value: '問題描述'
            },
            {
                property: 'LOCATION', value: '地點'
            },
            {
                property: 'PROBLEM_FLAG', value: '存在問題', more: {
                    pipe: {
                        name: 'replace',
                        params: [{Y: '是', N: '否'}]
                    }
                }
            },
            {
                property: 'PROBLEM_TYPE', value: '問題分類'
            },
            {
                property: 'PROBLEM_STATUS', value: '問題狀態', more: {
                    pipe: {
                        name: 'replace',
                        params: [{
                            New: '待分配',
                            Waiting: '待處理',
                            Done: '已處理'
                        }]
                    }
                }
            },
            {
                property: 'PROBLEM_PICTURES', value: '問題附圖', more: {
                    type: {
                        name: 'img'
                    },
                }
            },
            {
                property: 'OWNER_EMPNO', value: '處理人'
            },
            {
                property: 'INSPECTOR_NAME', value: '巡檢人員'
            },
            {
                property: 'INSPECT_DATE', value: '巡檢日期', more: {
                    pipe: {
                        name: 'date',
                        params: ['YYYY/MM/DD']
                    },
                    sortBy: {
                        name: 'date'
                    }
                }
            },
            {
                property: 'INSPECT_TIME', value: '巡檢時間', more: {
                    sortBy: {
                        name: 'byTime'
                    }
                }
            }
        ]
    }
}
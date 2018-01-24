export const DataDriveStore = {
    urgentMaterial: {
        id: 1,
        APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo=' },
        additionalFn: {
            filterColumn: true,
            fullScreen: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true
        },
        searchSets: [
            {
                property: 'LOT_NO',
                InputOpts: {
                    default: 'hhhh',
                    placeHolder: 'hhhhrtyrt',
                    match: {
                        regexp: '\\w+',
                        err: '不能為空'
                    }
                }
            },
            {
                property: 'CONTAINER_NO',
                InputOpts: {
                    type: 'number',
                    default: '2',
                    placeHolder: 'hhhhrtyrt',
                    more: {
                        min:3,
                        max:999
                    }
                }
            },
            {
                property: 'ATA_MSL_TIME',
                InputOpts: {
                    type: 'datepicker',
                    default: '2018-01-01',
                    more: {
                        pickerFormat: 'YYYY/MM/DD HH:mm',
                        showFormat: 'YYYY/MM/DD HH:mm',
                        showTime: true,
                    }
                }
            },
            {
                property: 'IQC_FINISHED_TIME',
                InputOpts: {
                    type: 'select',
                    default: 'hhh',
                    placeHolder: 'hhhrt',
                    more: {
                        options:[{property: 'hhh',value: 23}, {property: 'rerty',value: 45}]
                    }
                }
            }
        ],
        dataViewSet: {
            title: '急料看板',
            more: {
                pageSet: { enable: false },
                border_y: { enable: false },
                header: {
                    textColor: '#fff',
                    bgColor: '#000',
                    textSize: '1.8rem'
                },
                body: {
                    textColor: 'green',
                    bgColor: '#000',
                    textSize: '1.8rem',
                    rules: [
                        {
                            matches: [['IQC_FINISHED_TIME', '^\\s*$'], ['ATA_MSL_TIME', '^\\s*$']],
                            textColor: 'yellow',
                        },
                        {
                            matches: [['IQC_FINISHED_TIME', '^\\s*$']],
                            textColor: 'red',
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
            searchable: true,
            columns: [
                {
                    property: 'LOT_NO', value: 'LOT_NO', type: {}
                },
                {
                    property: 'CONTAINER_NO', value: '進口柜號', type: {}
                },
                {
                    property: 'CUSTOMS_TIME', value: '報關時間', type: {}
                },
                {
                    property: 'ATA_MSL_TIME', value: '回廠時間', type: {}
                },
                {
                    property: 'WO_NO', value: '工單', type: {}
                },
                {
                    property: 'PART_NO', value: '料號', type: {}
                },
                {
                    property: 'SHORTAGE_QUANTITY', value: '數量', type: {}
                },
                {
                    property: 'SIC_NAME', value: '對應庫別', type: {}
                },
                {
                    property: 'RECEIVE_TIME', value: '收料時間', type: {}
                },
                {
                    property: 'IQC_TIME', value: '送檢時間', type: {}
                },
                {
                    property: 'INPUT_DATE', value: '緊急時間', type: {}
                },
                {
                    property: 'IQC_FINISHED_TIME', value: '送檢完成時間', type: {}
                }
            ]
        }
    },

    urgentNo: {
        id: 2,
        APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo={wo}' },
        additionalFn: {
            filterColumn: true,
            fullScreen: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true
        },
        dataViewSet: {
            title: '急料工單看板',
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
                    property: 'LOT_NO', value: 'LOT_NO', type: {}
                },
                {
                    property: 'CONTAINER_NO', value: '進口柜號', type: {}
                },
                {
                    property: 'CUSTOMS_TIME', value: '報關時間', type: {}
                },
                {
                    property: 'ATA_MSL_TIME', value: '回廠時間', type: {}
                },
                {
                    property: 'WO_NO', value: '工單', type: {}
                },
                {
                    property: 'PART_NO', value: '料號', type: {}
                },
                {
                    property: 'SHORTAGE_QUANTITY', value: '數量', type: {}
                },
                {
                    property: 'SIC_NAME', value: '對應庫別', type: {}
                },
                {
                    property: 'RECEIVE_TIME', value: '收料時間', type: {}
                },
                {
                    property: 'IQC_TIME', value: '送檢時間', type: {}
                },
                {
                    property: 'INPUT_DATE', value: '緊急時間', type: {}
                },
                {
                    property: 'IQC_FINISHED_TIME', value: '送檢完成時間', type: {}
                }
            ]
        }
    }
};


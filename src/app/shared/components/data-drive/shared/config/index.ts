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
        // searchSets: [
        //     {
        //         property: 'LOT_NO',
        //         InputOpts: {
        //             default: 'hhhh',
        //             placeHolder: 'hhhhrtyrt',
        //             match: {
        //                 regexp: '\\w+',
        //                 err: '不能為空'
        //             }
        //         }
        //     },
        //     {
        //         property: 'PART_NO',
        //         InputOpts: {
        //             type: 'textarea',
        //             default: 'textarea placeHolder',
        //             placeHolder: 'textarea placeHolder',
        //         }
        //     },
        //     {
        //         property: 'CONTAINER_NO',
        //         InputOpts: {
        //             type: 'number',
        //             default: '2',
        //             placeHolder: 'hhhhrtyrt',
        //             more: {
        //                 min: 3,
        //                 max: 999
        //             }
        //         }
        //     },
        //     {
        //         property: 'ATA_MSL_TIME',
        //         InputOpts: {
        //             type: 'datePicker',
        //             default: '2018-01-01',
        //             more: {
        //                 pickerFormat: 'YYYY/MM/DD HH:mm',
        //                 showFormat: 'YYYY/MM/DD HH:mm',
        //                 showTime: true,
        //             }
        //         }
        //     },
        //     {
        //         property: 'IQC_FINISHED_TIME',
        //         InputOpts: {
        //             type: 'select',
        //             default: 'hhh',
        //             placeHolder: 'hhhrt',
        //             more: {
        //                 options: [{ property: 'hhh', value: 23 }, { property: 'rerty', value: 45 }]
        //             }
        //         }
        //     },
        //     {
        //         property: 'IQC_TIME',
        //         InputOpts: {
        //             type: 'timePicker',
        //             default: '14:56',
        //             placeHolder: 'hhhrt',
        //             more: {
        //                 pickerFormat: 'HH:mm',
        //                 showFormat: 'HH:mm'
        //             }
        //         }
        //     },
        //     {
        //         property: 'SHORTAGE_QUANTITY',
        //         InputOpts: {
        //             type: 'switch',
        //             default: 'Y',
        //             trueFormat: 'Y',
        //             falseFormat: 'N'
        //         }
        //     },
        //     {
        //         property: 'INPUT_DATE',
        //         InputOpts: {
        //             type: 'colleagueSearcher',
        //             default: 'Fx823'
        //         }
        //     },
        //     {
        //         property: 'WO_NO',
        //         InputOpts: {
        //             type: 'photoUpload',
        //             default: 'Images/IPQA/2018-01/a69a61a1-cc07-4f8e-9ed3-86b9ac776b13.png,Images/IPQA/2018-01/afdeadf0-7db8-41c1-9cee-f81d9b133e5b.png,Images/IPQA/2018-01/e060427e-02fa-4ba8-be42-6ceedf4e492f.png,Images/IPQA/2018-01/a9751ee3-c310-43a7-995a-98cfa18aacaf.png,Images/IPQA/2018-01/c5d1f307-4eea-4ccf-a588-8b4792edf5a3.png,Images/IPQA/2018-01/8e7be8d6-bb93-425b-855a-03104a3a06ac.png',
        //             more: {
        //                 pickerFormat: 'array',
        //                 maxCount: 5
        //             }
        //         }
        //     },
        //     {
        //         property: '级联演示',
        //         InputOpts: {
        //             type: 'cascader',
        //             placeHolder: 'hhhrt',
        //             properties: ['aaa','bbbb','ccc'],
        //             options: [{
        //                 value: 1,
        //                 label: 1,
        //                 children: [
        //                     // {
        //                     //     value: 12,
        //                     //     label: 12,
        //                     //     children: [
        //                     //         {
        //                     //             value: 121,
        //                     //             label: 121,
        //                     //             isLeaf: true
        //                     //         }
        //                     //     ]
        //                     // }
        //                 ]
        //             }],
        //             cascaderLazySets: [
        //                 {
        //                     lazyLayer: 1,
        //                 },
        //                 {
        //                     lazyLayer: 2,
        //                 }
        //             ],
        //             more: {
        //                 pickerFormat: 'HH:mm',
        //                 showFormat: 'HH:mm'
        //             }
        //         }
        //     }
        // ],
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

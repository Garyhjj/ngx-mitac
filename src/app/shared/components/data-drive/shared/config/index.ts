export const DataDriveStore = {
    examMapping: {
        id: 5,
        APIs: {
            search: 'EXAM/GetExamMappings?exam_id={exam_id}&company_id={company_id}',
            update: 'EXAM/UpdateMapping',
            delete: 'EXAM/DeleteMapping?id={id}'
        },
        additionalFn: {
            filterColumn: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true,
            toExcel: true,
            fullScreen: true,
            switchViewType: ['exam','table']
        },
        dataViewSet: {
            title: '考卷内容',
            more: {
                showAction: true
            }
        },
        updateSets: [
            {
                property: 'ID',
                InputOpts: {
                    type: 'primary',
                    default: 0
                }
            },
            {
                property: 'EXAM_ID',
                InputOpts: {
                    placeHolder: '',
                }
            },
            {
                property: 'TITLE',
                InputOpts: {
                    type: 'textarea',
                    editable: false,
                    placeHolder: '',
                }
            },
            {
                property: 'NUM',
                InputOpts: {
                    type: 'number',
                    placeHolder: '請输入序号',
                }
            },
            {
                property: 'SCORE',
                InputOpts: {
                    type: 'number',
                    placeHolder: '請输入分值',
                    more: {
                        min: 0,
                        max: 100
                    }
                }
            }
        ],
        tableData: {
            searchable: true,
            addable: true,
            deletable: true,
            isCompanyLimited: true,
            columns: [
                {
                    property: 'NUM', value: '序号'
                },
                {
                    property: 'SCORE', value: '分值(分)'
                },
                {
                    property: 'TITLE', value: '題目'
                },
                {
                    property: 'TYPE', value: '類別', more: {
                        pipe: {
                            name: 'replace',
                            parmas: [{ TF: '判斷題', RADIO: '單選題', CHECKBOX: '多選題' }]
                        }
                    }
                },
                {
                    property: 'OPTION_A', value: '選項A'
                },
                {
                    property: 'OPTION_B', value: '選項B'
                },
                {
                    property: 'OPTION_C', value: '選項C'
                },
                {
                    property: 'OPTION_D', value: '選項D'
                },
                {
                    property: 'OPTION_E', value: '選項E'
                },
                {
                    property: 'RIGHT_ANSWER', value: '正確答案'
                }
            ]
        }
    },
    examUnits: {
        id: 4,
        APIs: {
            search: 'EXAM/GetExams?id={id}&title={title}&ref_dept={ref_dept}&code={code}&version={version}&company_id={company_id}',
            update: 'EXAM/UpdateExam',
            delete: 'EXAM/DeleteExam?id={id}'
        },
        additionalFn: {
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true,
            toExcel: true,
            addItem: true
        },
        dataViewSet: {
            title: '考卷',
            more: {
                showAction: true,
                paramsOut: {
                    name: '配置考卷'
                },
                linkToPhone: {
                    name: '手機版考試',
                    url: 'http://10.86.16.74:8100/#/exam?examId={ID}'
                }
            }
        },
        searchSets: [
            {
                property: 'TITLE',
                apiProperty: 'title',
                InputOpts: {
                    type: 'textarea',
                    placeHolder: '請輸入考試名稱',
                }
            },
            {
                property: 'REF_DEPT',
                apiProperty: 'ref_dept',
                InputOpts: {
                    type: 'select',
                    placeHolder: '請選擇類別',
                    more: {
                        lazyAPI: 'GUID/GetDeptNameBySite?site=MSL'
                    }
                }
            },
            {
                property: 'CODE',
                apiProperty: 'code',
                InputOpts: {
                    placeHolder: '請輸入考試代號',
                }
            },
            {
                property: 'VERSION',
                apiProperty: 'version',
                InputOpts: {
                    placeHolder: '請輸入考試版本',
                }
            }
        ],
        updateSets: [
            {
                property: 'ID',
                InputOpts: {
                    type: 'primary',
                    default: 0
                }
            },
            {
                property: 'TITLE',
                InputOpts: {
                    type: 'textarea',
                    placeHolder: '請輸入考試名稱',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    }
                }
            },
            {
                property: 'REF_DEPT',
                InputOpts: {
                    type: 'select',
                    placeHolder: '請選擇類別',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    },
                    more: {
                        lazyAPI: 'GUID/GetDeptNameBySite?site=MSL'
                    }
                }
            },
            {
                property: 'CODE',
                InputOpts: {
                    placeHolder: '請輸入考試代號',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    }
                }
            },
            {
                property: 'VERSION',
                InputOpts: {
                    placeHolder: '請輸入考試版本',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    }
                }
            },
            {
                property: 'TIME',
                InputOpts: {
                    type: 'number',
                    placeHolder: '請輸入考試時長',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    },
                    more: {
                        min: 1
                    }
                }
            },
            {
                property: 'PASS_SCORE',
                InputOpts: {
                    type: 'number',
                    placeHolder: '請輸入考試及格分數',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    },
                    more: {
                        min: 0,
                        max: 100
                    }
                }
            },
            {
                property: 'FLAG',
                InputOpts: {
                    type: 'switch'
                }
            }

        ],
        tableData: {
            searchable: true,
            addable: true,
            deletable: true,
            isCompanyLimited: true,
            columns: [
                {
                    property: 'TITLE', value: '考試名稱'
                },
                {
                    property: 'REF_DEPT', value: '所屬部門'
                    ,more:{
                        pipe:{
                            name:'lazyLoad',
                            parmas: ['GUID/GetDeptNameBySite?site=MSL']
                        }
                    }
                },
                {
                    property: 'CODE', value: '代碼'
                },
                {
                    property: 'VERSION', value: '版本'
                },
                {
                    property: 'TIME', value: '考試時長(分鐘)',more: {
                        sortBy: {
                            name: 'byNumber'
                        }
                    }
                },
                {
                    property: 'PASS_SCORE', value: '及格分數(分)',more: {
                        sortBy: {
                            name: 'byNumber'
                        }
                    }
                },
                {
                    property: 'FLAG', value: '啟動'
                }
            ]
        }
    },
    examQuestions: {
        id: 3,
        APIs: {
            search: 'EXAM/GetExamQuestions?title={title}&type={type}',
            update: 'EXAM/UpdateQuestion',
            delete: 'EXAM/DeleteQuestion?id={id}'
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
            title: '測試題目',
            more: {
                showAction: true
            }
        },
        updateSets: [
            {
                property: 'ID',
                InputOpts: {
                    type: 'primary',
                    default: 0
                }
            },
            {
                property: 'TITLE',
                InputOpts: {
                    type: 'textarea',
                    placeHolder: '請輸入題目',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    }
                }
            },
            {
                property: 'TYPE',
                InputOpts: {
                    type: 'select',
                    placeHolder: '請選擇類別',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    },
                    more: {
                        options: [{ property: 'RADIO', value: '單選' }, { property: 'CHECKBOX', value: '多選' }, { property: 'TF', value: '判斷' }],
                        // lazyAPI: 'GUID/GetDeptNameBySite?site=MSL'
                    }
                }
            },
            {
                property: 'OPTION_A',
                InputOpts: {
                    placeHolder: '请输入第一個選項'
                }
            },
            {
                property: 'OPTION_B',
                InputOpts: {
                    placeHolder: '请输入第二個選項'
                }
            },
            {
                property: 'OPTION_C',
                InputOpts: {
                    placeHolder: '请输入第三個選項'
                }
            },
            {
                property: 'OPTION_D',
                InputOpts: {
                    placeHolder: '请输入第四個選項'
                }
            },
            {
                property: 'OPTION_E',
                InputOpts: {
                    placeHolder: '请输入第五個選項'
                }
            },
            {
                property: 'RIGHT_ANSWER',
                InputOpts: {
                    type: 'checkbox',
                    placeHolder: '请选择正確答案',
                    match: {
                        fns: [{ name: 'required' }],
                        err: '不能為空'
                    },
                    more: {
                        options: [
                            { property: 'A', value: '選項A' },
                            { property: 'B', value: '選項B' },
                            { property: 'C', value: '選項C' },
                            { property: 'D', value: '選項D' },
                            { property: 'E', value: '選項E' },
                            { property: 'Y', value: '正確' },
                            { property: 'N', value: '錯誤' },
                        ]
                    }
                }
            }
        ],
        searchSets: [
            {
                property: 'TITLE',
                apiProperty: 'title',
                InputOpts: {
                    placeHolder: '請輸入題目'
                }
            },
            {
                property: 'TYPE',
                apiProperty: 'type',
                InputOpts: {
                    type: 'select',
                    placeHolder: '請選擇類別',
                    more: {
                        options: [{ property: 'RADIO', value: '單選' }, { property: 'CHECKBOX', value: '多選' }, { property: 'TF', value: '判斷' }]
                    }
                }
            }
        ],
        tableData: {
            searchable: true,
            addable: true,
            deletable: true,
            columns: [
                {
                    property: 'TITLE', value: '題目'
                },
                {
                    property: 'TYPE', value: '類別', more: {
                        pipe: {
                            name: 'replace',
                            parmas: [{ TF: '判斷題', RADIO: '單選題', CHECKBOX: '多選題' }]
                        }
                    }
                },
                {
                    property: 'OPTION_A', value: '選項A'
                },
                {
                    property: 'OPTION_B', value: '選項B'
                },
                {
                    property: 'OPTION_C', value: '選項C'
                },
                {
                    property: 'OPTION_D', value: '選項D'
                },
                {
                    property: 'OPTION_E', value: '選項E'
                },
                {
                    property: 'RIGHT_ANSWER', value: '正確答案'
                    // ,more: {
                    //     sortBy: {name: 'byCharCode'}
                    // }
                }
            ]
        }
    },
    urgentMaterial: {
        id: 1,
        APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo=' },
        additionalFn: {
            filterColumn: true,
            fullScreen: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true,
            toExcel: true,
            // addItem: true
        },
        // updateSets: [
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
    },

    urgentNo: {
        id: 2,
        APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo={wo}' },
        additionalFn: {
            filterColumn: true,
            fullScreen: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true,
            toExcel: true
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
};


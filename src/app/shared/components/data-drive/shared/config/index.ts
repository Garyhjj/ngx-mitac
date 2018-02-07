export const DataDriveStore = {
    examResults: {
        id: 6,
        APIs: {
            search: 'EXAM/GetExamResults?id={id}&date={date}'
        },
        additionalFn: {
            filterColumn: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true,
            menu: true,
            toExcel: true
        },
        dataViewSet: {
            title: '考試結果',
            more: {
                header: {
                    textColor: '#fff',
                    bgColor: '#000',
                    textSize: '1.6rem'
                },
                body: {
                    bgColor: '#000',
                    textColor: 'green',
                    textSize: '1.6rem',
                    rules: [
                        {
                            matches: [['RESIT', '^\是$']],
                            textColor: 'red',
                        }
                    ]
                },
            }
        },
        searchSets: [
            {
                property: '科目',
                apiProperty: 'id',
                InputOpts: {
                    type: 'select',
                    placeHolder: '請選擇科別',
                    more: {
                        lazyAPI: 'EXAM/GetExams?id=&title=&ref_dept={ref_dept}&code=&version=&company_id={company_id}',
                        lazyParams: ['ID', 'TITLE'],
                        lazyAPIUserMes: {
                            ref_dept: '',
                            company_id: 'COMPANY_ID'
                        }
                    }
                }
            },
            {
                property: 'IDATE',
                apiProperty: 'date',
                InputOpts: {
                    type: 'datePicker',
                    more: {
                        pickerFormat: 'YYYY/MM/DD'
                    }
                }
            },
        ],
        tableData: {
            searchable: true,
            columns: [
                {
                    property: 'EMPNO', value: '工號'
                },
                {
                    property: 'NICK_NAME', value: '姓名'
                },
                {
                    property: 'IDATE', value: '日期'
                },
                {
                    property: 'TIME', value: '完成時間', more: {
                        sortBy: {
                            name: 'byTime'
                        }
                    }
                },
                {
                    property: 'TITLE', value: '考試科別'
                },
                {
                    property: 'RESULT', value: '分數', more: {
                        sortBy: {
                            name: 'byNumber'
                        }
                    }
                },
                {
                    property: 'WRONG_QUESTION', value: '錯題代號'
                },
                {
                    property: 'RESIT', value: '是否補考'
                },
            ]
        }
    },
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
            switchViewType: ['exam', 'table']
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
                    name: '考試連接',
                    url: 'http://10.86.16.74:8100/#/exam?examId={ID}',
                    local: '/exam/do/{ID}'
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
                    , more: {
                        pipe: {
                            name: 'lazyLoad',
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
                    property: 'TIME', value: '考試時長(分鐘)', more: {
                        sortBy: {
                            name: 'byNumber'
                        }
                    }
                },
                {
                    property: 'PASS_SCORE', value: '及格分數(分)', more: {
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
                        },
                        sortBy: {
                            name: 'byCharCode'
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


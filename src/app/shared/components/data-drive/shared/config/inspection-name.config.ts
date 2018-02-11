export const inspectionNameConfig = {
    id: 8,
    APIs: { 
        search: 'IPQA/GetMRIName?company_name={company_name}&type={type}',
        update: 'IPQA/UpdateMRIName',
        delete: 'IPQA/DeleteMRIName?name_id={NAME_ID}'
     },
    additionalFn: {
        addItem: true,
        filterColumn: true,
        changeBodyFontSize: true,
        changeHeaderFontSize: true,
        menu: true,
        toExcel: true
    },
    dataViewSet: {
        title: '巡檢名稱',
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
            property: 'INSPECT_NAME',
            InputOpts: {
                placeHolder: '請輸入巡檢名稱',
                match: {
                    fns: [{ name: 'required' }],
                    err: '不能為空'
                }
            }
        },
        {
            property: 'ADMIN_EMPNO',
            InputOpts: {
                type: 'colleagueSearcher'
            }
        },
        {
            property: 'DESCRIPTION',
            InputOpts: {
                placeHolder: '請輸入備註'
            }
        },
        {
            property: 'ENABLED',
            InputOpts: {
                type: 'switch'
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
                    options: [{ property: 'IPQA', value: 'IPQA巡檢' }, { property: 'boss', value: '主管巡檢' }, { property: 'equip', value: '設備巡檢' }],
                }
            }
        },
        {
            property: 'INSPECT_PERIOD',
            InputOpts: {
                type: 'select',
                placeHolder: '請選擇類別',
                match: {
                    fns: [{ name: 'required' }],
                    err: '不能為空'
                },
                more: {
                    options: [{ property: 'daily', value: '每日' }, { property: 'weekly', value: '每日' }, { property: 'monthly', value: '每月' }],
                }
            }
        }
    ],
    searchSets: [
        {
            property: 'TYPE',
            apiProperty: 'type',
            InputOpts: {
                type: 'select',
                placeHolder: '請選擇類別',
                more: {
                    options: [{ property: 'IPQA', value: 'IPQA巡檢' }, { property: 'boss', value: '主管巡檢' }, { property: 'equip', value: '設備巡檢' }]
                }
            }
        }
    ],
    tableData: {
        searchable: true,
        addable: true,
        deletable: true,
        isCompanyLimited: 'company_name',
        columns: [
            {
                property: 'INSPECT_NAME', value: '巡檢名稱'
            },
            {
                property: 'DESCRIPTION', value: '備註'
            },
            {
                property: 'ADMIN_EMPNO', value: '管理員工號'
            },
            {
                property: 'ENABLED', value: '有效', more: {
                    pipe: {
                        name: 'replace',
                        params: [{ Y: '有', N: '無' }]
                    },
                }
            },
            {
                property: 'TYPE', value: '分類', more: {
                    pipe: {
                        name: 'replace',
                        params: [{ IPQA: 'IPQA巡檢', boss: '主管巡檢', equip: '設備巡檢' }]
                    },
                }
            },
            {
                property: 'INSPECT_PERIOD', value: '巡檢頻率', more: {
                    pipe: {
                        name: 'replace',
                        params: [{ weekly: '每週', daily: '每日', monthly: '每月' }]
                    },
                }
            },
            {
                property: 'COMPANY_NAME', value: '公司名稱'
            }
        ]
    }
}
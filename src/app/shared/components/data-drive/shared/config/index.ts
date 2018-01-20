export const DataDriveStore = {
    urgentMaterial: {
        id: 1,
        APIs: { search: 'UrgentMaterial/GetUrgentMaterial?wo=' },
        additionalFn: {
            filterColumn: true,
            fullScreen: true,
            changeBodyFontSize: true,
            changeHeaderFontSize: true
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
                            matches: [['LOT_NO', '^\s*$'], ['SHORTAGE_QUANTITY', '^[1-9][0-9]{2,}$']],
                            textColor: 'yellow',
                        },
                        {
                            matches: [['LOT_NO', '^\s*$']],
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
            columns: [
                {
                    property: 'LOT_NO', value: 'LOT_NO', type: {}
                },
                {
                    property: 'CONTAINER_NO', value: 'CONTAINER_NO', type: {}
                },
                {
                    property: 'CUSTOMS_TIME', value: 'CUSTOMS_TIME', type: {}
                },
                {
                    property: 'ATA_MSL_TIME', value: 'ATA_MSL_TIME', type: {}
                },
                {
                    property: 'WO_NO', value: 'WO_NO', type: {}
                },
                {
                    property: 'PART_NO', value: 'PART_NO', type: {}
                },
                {
                    property: 'SHORTAGE_QUANTITY', value: 'SHORTAGE_QUANTITY', type: {}
                },
                {
                    property: 'SIC_NAME', value: 'SIC_NAME', type: {}
                },
                {
                    property: 'RECEIVE_TIME', value: 'RECEIVE_TIME', type: {}
                },
                {
                    property: 'IQC_TIME', value: 'IQC_TIME', type: {}
                },
                {
                    property: 'INPUT_DATE', value: 'INPUT_DATE', type: {}
                },
                {
                    property: 'IQC_FINISHED_TIME', value: 'IQC_FINISHED_TIME', type: {}
                }
            ]
        }
    }
};


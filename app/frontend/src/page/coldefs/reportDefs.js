import DeleteButtonRenderer from "./DeleteButtonRenderer"

function handleDelete(event) {
    const isConfirmed = window.confirm(`Are you sure you want to delete report: ${event.data.record_no}`);
    if (isConfirmed) {
        fetch(`http://localhost:3001/delreport?record_no=${event.data.record_no}`).then((response) => response.text()).then((msg) => {
            window.location.reload();
        });
    }
}

export const colDefs1 = [
    {
        headerName: '',
        cellRenderer: DeleteButtonRenderer,
        onCellClicked: handleDelete
    },
    { field: "user_id", headerName: "User ID", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "record_no", headerName: "Record No", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "crm_desc", headerName: "Crime", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "status_desc", headerName: "Status", type: 'numericColumn', cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_age", headerName: "Victim Age", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_sex", headerName: "Victim Sex", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_descent", headerName: "Victim Descent", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "weapon_desc", headerName: "Weapon", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "premise_desc", headerName: "Premise", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "location", headerName: "Location", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "date_rptd", headerName: "Date Reported", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
]

export const colDefs2 = [
    { field: "record_no", headerName: "Record No", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "crm_desc", headerName: "Crime", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "status_desc", headerName: "Status", type: 'numericColumn', cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_age", headerName: "Victim Age", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_sex", headerName: "Victim Sex", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "vict_descent", headerName: "Victim Descent", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "weapon_desc", headerName: "Weapon", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "premise_desc", headerName: "Premise", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "location", headerName: "Location", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "user_id", headerName: "User ID", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
    { field: "date_rptd", headerName: "Date Reported", cellStyle: { textAlign: 'left' }, headerClass: 'header-center' },
]
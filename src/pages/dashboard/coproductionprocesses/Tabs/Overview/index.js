import { Alert, Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { AssetsTable } from "components/dashboard/assets";
import React, { useEffect, useState } from "react";
import { fetchJsFromCDN } from "utils/fetchFromCDN";
import { assetsApi } from "__fakeApi__";

const OverviewTab = ({ coproductionprocess }) => {
    const [assets, setAssets] = useState([])
    useEffect(() => {
        assetsApi.getMulti({ coproductionprocess_id: coproductionprocess.id }).then((res) => {
            setAssets(res.items)
            fetchJsFromCDN('https://cdnjs.cloudflare.com/ajax/libs/frappe-charts/2.0.0-rc20/frappe-charts.min.umd.js', ['frappe']).then(([frappe]) => {
                let heatmap = new frappe.Chart("#chart", {
                    type: 'heatmap',
                    title: "Monthly Distribution",
                    data: {
                        dataPoints: {
                            '1645182204': 8,
                        },
                    },
                    countLabel: 'contributions',
                    discreteDomains: 0,
                    colors: ['#ebedf0', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'],
                });
            })
        })


    }, [])

    function createData(date, action, user, role) {
        return { date, action, user, role };
    }

    const rows = [
        createData(new Date(), "Created X asset", "Julen Badiola", "Administrator"),
        createData(new Date("18-10-1999"), "Updated Y asset", "Julen Badiola", "Administrator"),
    ];

    const warnings = [
        "Some process metadata has not been entered yet",
        "Process schema has not been selected yet"
    ]

    return (
        <Box style={{ backgroundColor: "background.default", justifyContent: "center" }}>

            <Typography variant="h5" sx={{ my: 2, textAlign: "center" }} color="textSecondary">
                Recent activity
            </Typography>
            {/* {warnings.map((warning, i) => <Alert key={warning + i.toString()} severity="warning" sx={{mb: 2}}>{warning}</Alert>)}
                    
                    <Divider />
                    <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
                        Top contributors
                    </Typography>*/}
                    <Box sx={{ justifyContent: "center", textAlign: "center" }}>
            <div id="chart"></div>
            </Box>
            <Divider />


            <Typography variant="h5" sx={{ my: 2, textAlign: "center", }} color="textSecondary">
                Recent assets
            </Typography>
            <Box sx={{ mb: 3 }}>
                <AssetsTable assets={assets} actions={<Button variant="outlined" size="small">See task</Button>} />
            </Box>
        </Box>
    );
};

export default OverviewTab
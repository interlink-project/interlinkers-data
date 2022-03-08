import { Alert, Box, Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import { AssetsTable } from "components/dashboard/assets";
import React, { useEffect, useState } from "react";
import { fetchJsFromCDN } from "utils/fetchFromCDN";
import { assetsApi } from "__fakeApi__";

const dateToUnix = (dateStr) => Math.floor(new Date(dateStr).getTime() / 1000)

const OverviewTab = ({ coproductionprocess }) => {
    const [assets, setAssets] = useState([])
    useEffect(() => {
        assetsApi.getMulti({ coproductionprocess_id: coproductionprocess.id }).then((res) => {
            setAssets(res.items)
            fetchJsFromCDN('https://cdnjs.cloudflare.com/ajax/libs/frappe-charts/2.0.0-rc20/frappe-charts.min.umd.js', ['frappe']).then(([frappe]) => {
                new frappe.Chart("#chart", {
                    type: 'heatmap',
                    data: {
                        dataPoints: res.items.reduce((total, el) => {
                            const unix = dateToUnix(el.created_at)
                            if (unix in total){
                                total[unix] = total[unix] + 1
                                return total
                            }else{
                                total[unix] = 1
                                return total
                            }
                         }, {})
                    },
                    countLabel: 'assets created',
                    discreteDomains: 0,
                    colors: ['#ebedf0', '#c0ddf9', '#73b3f3', '#3886e1', '#17459e'],
                });
            })
        })


    }, [])

    return (
        <Box style={{ backgroundColor: "background.default", justifyContent: "center" }}>

            <Typography variant="h5" sx={{ my: 2, textAlign: "center" }} color="textSecondary">
                Activity within the project
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
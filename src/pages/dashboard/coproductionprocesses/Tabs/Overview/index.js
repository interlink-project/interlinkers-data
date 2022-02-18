import { Alert, Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { fetchJsFromCDN } from "utils/fetchFromCDN";

const OverviewTab = () => {
    useEffect(() => {
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
        <Box style={{ minHeight: "83vh", backgroundColor: "background.default" }}>
            <Grid container justifyContent="center" spacing={3} sx={{ height: "100%"}}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
                        Recent activity
                    </Typography>
                    {warnings.map((warning, i) => <Alert key={warning + i.toString()} severity="warning" sx={{mb: 2}}>{warning}</Alert>)}
                    <div id="chart"></div>
                    <Divider />
                    <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
                        Top contributors
                    </Typography>
                    
                    <Divider />
                    
                </Grid>
                <Grid item xs={12} md={6} >
                    <Typography variant="h6" sx={{ my: 2, textAlign: "center", }}>
                        Recent assets
                    </Typography>
                    <TableContainer sx={{ height: "100%", overflowY: 'scroll',}}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Action</TableCell>
                                <TableCell align="right">User</TableCell>
                                <TableCell align="right">Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date.toString()}
                                    </TableCell>
                                    <TableCell align="right">{row.action}</TableCell>
                                    <TableCell align="right">{row.user}</TableCell>
                                    <TableCell align="right">{row.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    
                </Grid>
            </Grid>



        </Box>
    );
};

export default OverviewTab
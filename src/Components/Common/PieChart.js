import React, { useRef, useLayoutEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { makeStyles, Collapse, List, ListItem, ListSubheader, ListItemIcon, ListItemText } from '@material-ui/core';
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
am4core.useTheme(am4themes_animated);

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));
function PieChart(props) {
    console.log(props);
    const [data, setData] = useState(props.data);
    useLayoutEffect(() => {
        let chart = am4core.create('chartdiv', am4charts.PieChart3D);
        chart.legend = new am4charts.Legend();
        chart.legend.position = 'right';
        chart.legend.scrollable = true;
        chart.legend.align = 'center';
        chart.paddingRight = 20;
        chart.innerRadius = am4core.percent(40);
        chart.data = props.data;
        chart.align = 'center';
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = 'views';
        pieSeries.dataFields.category = 'title';
        pieSeries.slices.template.stroke = am4core.color('#fff');
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;
        return () => {
            chart.dispose();
        };
    }, [props.data]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <List component="nav" className={classes.root}>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <DonutLargeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Firstaid Procedure Views Analytics" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" style={{ width: '100%' }}>
                <div style={{ width: '100%', height: '500px', padding: '10px 20px' }}>
                    <div
                        style={{
                            width: '100%',
                            height: '450px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div id="chartdiv" style={{ width: '50%', height: '500px' }}></div>
                    </div>
                </div>
            </Collapse>
        </List>
    );
}

export default PieChart;

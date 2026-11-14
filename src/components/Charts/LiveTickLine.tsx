import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import type { RootState } from "@modules/redux/store";

const LiveTickLine = () => {
    const lineData = useSelector((state: RootState) => state.areaSpline.data);

    const chartOptions = {
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        rangeSelector: {
            enabled: false
        },
        xAxis: {
            type: "datetime" as const,
        },
        series: [{
            name: "Live Price Update",
            data: lineData,
            type: "spline",
        }],
        title: {
            style: {
                opacity: 0
            }
        },
        tooltip: {
            formatter: function(this: Highcharts.Point) {
                return '<b>Time:</b> ' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' +
                    '<b>Date:</b> ' + Highcharts.dateFormat('%e %B %Y', this.x) + '<br/>' +
                    '<b>Price:</b> ' + Highcharts.numberFormat(this.y, 2);
            }
        },
        yAxis: {
            title: {
                text: "Price"
            }
        }
    }

    return lineData.length === 0 ? <span>Loading...</span> : (
        <HighchartsReact 
            highcharts={Highcharts}
            options={chartOptions}
        />
    )
};

export default LiveTickLine;
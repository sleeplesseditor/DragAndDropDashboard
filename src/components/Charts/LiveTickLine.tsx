import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import type { AppStore } from "@modules/redux/store";
import { TWO_PANE_BUCKET_MS } from "@modules/area-spline/slice";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import useHighchartsResize from "@helpers/useHighchartsResize";

const LiveTickLine = () => {
    const store = useStore<AppStore>();
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HighchartsReactRefObject | null>(null);
    const resizeChart = useHighchartsResize(containerRef, chartRef);
    const [lineData, setLineData] = useState(() => store.getState().areaSpline.data);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setLineData(store.getState().areaSpline.data);
        }, TWO_PANE_BUCKET_MS);

        return () => window.clearInterval(intervalId);
    }, [store]);

    const chartOptions = {
        chart: {
            reflow: true
        },
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
            labels: {
                format: '{value:%H:%M:%S }'
            },
            rotation: -45,
            type: "datetime" as const,
        },
        series: [{
            name: "Live Price Update",
            data: lineData,
            type: "areaspline",
            threshold: null,
            color: '#2caffe',
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#2caffe'],
                        [1, '#2caffe00']
                    ]
                },
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

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {lineData.length === 0 ? <span>Loading...</span> : (
                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    options={chartOptions}
                    callback={resizeChart}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            )}
        </div>
    );
};

export default LiveTickLine;
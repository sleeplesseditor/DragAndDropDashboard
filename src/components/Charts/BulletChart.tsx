import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import "highcharts/modules/bullet";
import { useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@modules/redux/store";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import useHighchartsResize from "@helpers/useHighchartsResize";

const BulletChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HighchartsReactRefObject | null>(null);
    const resizeChart = useHighchartsResize(chartContainerRef, chartRef);

    const chartContainerRefSecond = useRef<HTMLDivElement>(null);
    const chartRefSecond = useRef<HighchartsReactRefObject | null>(null);
    const resizeChartSecond = useHighchartsResize(chartContainerRefSecond, chartRefSecond);

    const chartContainerRefThird = useRef<HTMLDivElement>(null);
    const chartRefThird = useRef<HighchartsReactRefObject | null>(null);
    const resizeChartThird = useHighchartsResize(chartContainerRefThird, chartRefThird);

    const quote = useSelector((state: RootState) => state.selection.quote);
    const {
        currentPrice,
        openingPrice,
        lowPrice,
        highPrice,
        previousClosePrice
    } = quote;

    if (
        typeof currentPrice !== "number" || !Number.isFinite(currentPrice) ||
        typeof openingPrice !== "number" || !Number.isFinite(openingPrice) ||
        typeof lowPrice !== "number" || !Number.isFinite(lowPrice) ||
        typeof highPrice !== "number" || !Number.isFinite(highPrice) ||
        typeof previousClosePrice !== "number" || !Number.isFinite(previousClosePrice) ||
        previousClosePrice === 0
    ) {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <span>Loading quote...</span>
            </div>
        );
    }

    const dailyPercentageChange = ((currentPrice - previousClosePrice) / previousClosePrice) * 100;
    const firstChartMin = Math.min(lowPrice, openingPrice);
    const firstChartMax = Math.max(highPrice, openingPrice);

    const chartOptions = {
        chart: {
            inverted: true,
            type: "bullet" as const,
            reflow: true
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            bullet: {
                pointPadding: 0.25,
                borderWidth: 0,
                targetOptions: {
                    width: "200%",
                    color: "#333333"
                }
            }
        },
        title: {
            text: null
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ["Session Open vs. Live Price"],
            labels: {
                formatter: function() {
                    return `<b>Session Open vs.<br/> Live Price</b>`
                }
            },
            title: {
                text: null
            }
        },
        yAxis: [{
            labels: {
                formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                    return `<b>${this.value}</b>`
                }
            },
            min: firstChartMin,
            max: firstChartMax,
            plotBands: [
                {
                    from: -1e9,
                    to: openingPrice,
                    color: 'rgba(128, 128, 128, 0.1)'
                },
                {
                    from: openingPrice,
                    to: 1e9,
                    color: 'rgba(128, 128, 128, 0.2)'
                }
            ],
            title: {
                text: "<b>Price</b>"
            }
        }],
        series: [{
            name: "Session Open vs. Live Price",
            type: "bullet" as const,
            yAxis: 0,
            data: [{
                x: 0,
                y: currentPrice,
                target: openingPrice,
                color: "#2caffe"
            }],
            targetOptions: {
                color:"#2caffe",
            },
            tooltip: {
                pointFormat: "<b>{point.y:.2f}</b> (with target at {point.target:.2f})"
            }
        }]
    };

    const secondOptions = {
        ...chartOptions,
        xAxis: {
            categories: ["Daily Percentage Change"],
            labels: {
                formatter: function() {
                    return `<b>Daily Percentage<br/> Change</b>`
                },
            },
            title: {
                text: null
            }
        },
        yAxis: [{
            labels: {
                formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                    return `<b>${this.value}</b>`
                }
            },
            plotBands: [
                {
                    from: -5,
                    to: 0,
                    color: 'rgba(128, 128, 128, 0.1)'
                },
                {
                    from: 0,
                    to: 5,
                    color: 'rgba(128, 128, 128, 0.2)'
                }
            ],
            softMin: -5,
            softMax: 5,
            title: {
                text: "<b>Change (%)<b/>"
            },            
        }],
        series: [{
            name: "Daily Percentage Change",
            type: "bullet" as const,
            yAxis: 0,
            data: [{
                x: 0,
                y: dailyPercentageChange,
                target: 0,
                color: dailyPercentageChange < 0 ? "red" : "#34df34"
            }],
            targetOptions: {
                color: dailyPercentageChange < 0 ? "red" : "#34df34"
            },
            tooltip: {
                pointFormat: "<b>{point.y:.2f}%</b> (with target at {point.target:.2f}%)"
            }
        }]
    }

    const thirdOptions = {
        ...chartOptions,
        xAxis: {
            categories: ["Intraday Range"],
            labels: {
                formatter: function() {
                    return `<b>Intraday Range</b>`
                },
            },
            title: {
                text: null
            }
        },
        yAxis: [{
            labels: {
                formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                    return `<b>${this.value}</b>`
                }
            },
            plotBands: [
                {
                    from: -1e9,
                    to: previousClosePrice,
                    color: 'rgba(128, 128, 128, 0.1)'
                },
                {
                    from: previousClosePrice,
                    to: 1e9,
                    color: 'rgba(128, 128, 128, 0.2)'
                }
            ],
            min: Math.min(lowPrice, previousClosePrice),
            max: Math.max(highPrice, previousClosePrice),
            title: {
                text: "<b>Price<b/>"
            },            
        }],
        series: [{
            name: "Intraday Range",
            pointPadding: 0.25,
            type: "bullet" as const,
            yAxis: 0,
            data: [{
                x: 0,
                y: currentPrice,
                target: previousClosePrice,
                color: currentPrice >= previousClosePrice ? "#26a69a" : "#ef5350"
            }],
            targetOptions: {
                color: "#2caffe"
            },
            tooltip: {
                pointFormat: "<b>{point.y:.2f}%</b> (with target at {point.target:.2f}%)"
            }
        }]
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: 0
        }}>
            <div ref={chartContainerRef} style={{ flex: "1 1 0", height: 85 }}>
                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    options={chartOptions}
                    callback={resizeChart}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            </div>
            <div ref={chartContainerRefSecond} style={{ flex: "1 1 0", height: 85 }}>
                <HighchartsReact
                    ref={chartRefSecond}
                    highcharts={Highcharts}
                    options={secondOptions}
                    callback={resizeChartSecond}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            </div>
            <div ref={chartContainerRefThird} style={{ flex: "1 1 0", height: 85 }}>
                <HighchartsReact
                    ref={chartRefThird}
                    highcharts={Highcharts}
                    options={thirdOptions}
                    callback={resizeChartThird}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            </div>
        </div>
    )
};

export default BulletChart;
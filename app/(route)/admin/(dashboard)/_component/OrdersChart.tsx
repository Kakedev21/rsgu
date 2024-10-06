"use client"

import useOrder from "@/hooks/useOrder";
import { LoaderCircle } from "lucide-react";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";

interface OrderChartProps {
    status: string;
    type: string;
    countType?: string;
    month?: string;
    year?: string;
    chartHeight?: string
}
const OrdersChart: FC<OrderChartProps> = ({status, type = "bar", countType, month, year, chartHeight}) => {
    const orderHook = useOrder({init:false});
    const [totalCount, setTotalCount] = useState<any>();
    const getCategories = () => {
        if (countType === "daily") {
            return totalCount ? totalCount.map((count: any) => moment(count.date).format("DD")).flat() : []
        }
        return totalCount ? totalCount?.map((count: any) => Object.keys(count)).flat() : []
    }
    const getYaxis = () => {
        if (countType === "daily") {
            return totalCount ? Math.max(...totalCount.map((count: any) => count?.totalCount).flat()) + 5 : 100
        }

        return totalCount ? Math.max(...totalCount?.map((count: any) => Object.values(count)).flat()) : 100
    } 
    const getData = () => {
        if (countType === "daily") {
            return totalCount ? totalCount.map((count: any) => count?.totalCount).flat() : []
        }

        return totalCount ? totalCount?.map((count: any) => Object.values(count)).flat() : []
    }
    const config = useMemo(() => {
        
        return {
            optionsMixedChart: {
              chart: {
                id: "basic-bar",
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                bar: {
                  columnWidth: "50%"
                }
              },
              stroke: {
                width: [4, 0, 0]
              },
              xaxis: {
                categories: getCategories()
              },
              markers: {
                size: 6,
                strokeWidth: 3,
                fillOpacity: 0,
                strokeOpacity: 0,
                hover: {
                  size: 8
                }
              },
              yaxis: {
                tickAmount: 5,
                min: 0,
                max: getYaxis()
              }
            },
            seriesMixedChart: [
              {
                name: status,
                type: type,
                data: getData()
              },
            ],
            optionsRadial: {
              plotOptions: {
                radialBar: {
                  startAngle: -135,
                  endAngle: 225,
                  hollow: {
                    margin: 0,
                    size: "70%",
                    background: "#fff",
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: "front",
                    dropShadow: {
                      enabled: true,
                      top: 3,
                      left: 0,
                      blur: 4,
                      opacity: 0.24
                    }
                  },
                  track: {
                    background: "#fff",
                    strokeWidth: "67%",
                    margin: 0, // margin is in pixels
                    dropShadow: {
                      enabled: true,
                      top: -3,
                      left: 0,
                      blur: 4,
                      opacity: 0.35
                    }
                  },
      
                  dataLabels: {
                    showOn: "always",
                    name: {
                      offsetY: -20,
                      show: true,
                      color: "#888",
                      fontSize: "13px"
                    },
                    value: {
                      formatter: function (val: any) {
                        return val;
                      },
                      color: "#111",
                      fontSize: "30px",
                      show: true
                    }
                  }
                }
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "dark",
                  type: "horizontal",
                  shadeIntensity: 0.5,
                  gradientToColors: ["#ABE5A1"],
                  inverseColors: true,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100]
                }
              },
              stroke: {
                lineCap: "round"
              },
              labels: ["Percent"]
            },
            seriesRadial: [76],
            optionsBar: {
              chart: {
                stacked: true,
                stackType: "100%",
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                bar: {
                  horizontal: true
                }
              },
              dataLabels: {
                dropShadow: {
                  enabled: true
                }
              },
              stroke: {
                width: 0
              },
              xaxis: {
                categories: ["Fav Color"],
                labels: {
                  show: false
                },
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                }
              },
              fill: {
                opacity: 1,
                type: "gradient",
                gradient: {
                  shade: "dark",
                  type: "vertical",
                  shadeIntensity: 0.35,
                  gradientToColors: undefined,
                  inverseColors: false,
                  opacityFrom: 0.85,
                  opacityTo: 0.85,
                  stops: [90, 0, 100]
                }
              },
      
              legend: {
                position: "bottom",
                horizontalAlign: "right"
              }
            },
            
        };
    }, [totalCount])
    useEffect(() => {
        if (!totalCount && !orderHook.loading) {
            (async () => {
             const result = countType === "daily" ? await orderHook.getTotalCountPerDayForMonth(month as string, year as string) : await  orderHook.getTotalCountPerMonth(status);
             console.log("result", result);
             setTotalCount(result)
            })()
        }
    }, []);
    console.log("getCategories()", getCategories())
    if (orderHook.loading && !totalCount) {
        return <div className='w-full flex justify-center p-5 items-center gap-2'>
        <LoaderCircle className=' animate-spin text-slate-600' />
        <p className='text-slate-600 animate-pulse'>Loading...</p>
      </div>
    }
    return (
        <div>
             <Chart
                options={config.optionsMixedChart}
                series={config.seriesMixedChart}
                type="bar"
                width="100%"
                height={chartHeight}
            />
        </div>
    );
}
 
export default OrdersChart;
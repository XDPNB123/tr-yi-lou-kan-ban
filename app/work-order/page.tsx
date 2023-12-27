"use client";

import { MagicCard } from "@/components/card/MagicCard";
import { WavePercent } from "@/components/percent/WavePercent";
import { useEffect, useState } from "react";
import { AreaBarChart } from "@/components/chart/AreaBarChart";

const WorkOrderPage = () => {
  const [boardData, setBoardData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>([
    { date: 0, qutstanding: 0, completed: 0 },
    { date: 0, qutstanding: 0, completed: 0 },
  ]);

  const getChartData = async () => {
    const res = await fetch(
      "http://10.0.20.61:8068/Board/M93GetWorkcenterInfo",
      {
        method: "GET",
      }
    );

    if (!res) return;

    const { data } = await res.json();

    const result = data.reduce((a: any, b: any) => {
      if (!a[b.type]) {
        a[b.type] = {};
      }
      if (!a[b.type][b.date]) {
        a[b.type][b.date] = { date: b.date, completed: 0, qutstanding: 0 };
      }
      a[b.type][b.date].completed += b.completed;
      a[b.type][b.date].qutstanding += b.qutstanding;
      return a;
    }, {});

    console.log(result);
    // 将对象转换为数组
    for (let type in result) {
      result[type] = Object.values(result[type]);
    }

    console.log(result);

    setChartData(result);
  };

  const getBoardData = async () => {
    try {
      const res = await fetch(
        "http://10.0.20.61:8068/Board/M90GetWorkcenterInfo",
        {
          method: "GET",
        }
      );
      if (!res) return;

      const { data } = await res.json();

      if (!data) return;

      const result = data
        .map((item: any) => {
          return {
            ...item,
            percent:
              item.qutstanding === 0 && item.completed === 0
                ? 0
                : Number(
                    (
                      item.completed /
                      (item.qutstanding + item.completed)
                    ).toFixed(2)
                  ) * 100,
          };
        })
        .reduce((a: any, b: any) => {
          if (!a[b.type]) {
            a[b.type] = [];
          }
          a[b.type].push(b);
          return a;
        }, {});

      setBoardData(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBoardData();
    getChartData();

    const dataInterval = setInterval(() => {
      getBoardData();
      getChartData();
    }, 5000);

    // 清除定时器
    return () => {
      clearInterval(dataInterval);
    };
  }, []);
  return (
    <>
      <div className="w-full h-full ">
        <div className="grid grid-cols-3 justify-items-center items-center mt-[4vh]">
          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">开料工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["机加工"]?.[0]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-4">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["机加工"]?.[0]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["机加工"]?.[0]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">下料工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["机加工"]?.[1]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["机加工"]?.[1]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["机加工"]?.[1]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">机加工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["机加工"]?.[2]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["机加工"]?.[2]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：{" "}
                  <span className="text-red-300">
                    {boardData?.["机加工"]?.[2]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>
        </div>

        <div className="flex justify-center mt-16">
          <div className="w-[91vw] ">
            <MagicCard className="h-[54vh] before:w-[101%] before:h-[103%]">
              <div className="text-4xl font-medium text-slate-300 text-center mt-6 w-full">
                机加工站近一个月生产趋势图
              </div>

              <AreaBarChart data={chartData["机加工"]} />
            </MagicCard>
          </div>
        </div>
      </div>
      <div className="w-full h-full ">
        <div className="grid grid-cols-4 justify-items-center items-center mt-[4vh]">
          <MagicCard className="w-[20vw] h-[32vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">电气装配工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["装配"]?.[0]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-4">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["装配"]?.[0]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["装配"]?.[0]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[20vw] h-[32vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">单机装配工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["装配"]?.[1]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["装配"]?.[1]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["装配"]?.[1]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[20vw] h-[32vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">成套装配工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["装配"]?.[2]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className=" text-green-300">
                    {boardData?.["装配"]?.[2]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className=" text-red-300">
                    {boardData?.["装配"]?.[2]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[20vw] h-[32vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">成品发货工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["装配"]?.[2]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className=" text-green-300">
                    {boardData?.["装配"]?.[2]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className=" text-red-300">
                    {boardData?.["装配"]?.[2]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>
        </div>

        <div className="flex justify-center mt-12">
          <div className="w-[94vw] ">
            <MagicCard className="h-[56vh] before:w-[101%] before:h-[103%]">
              <div className="text-4xl font-medium text-slate-300 text-center mt-6 w-full">
                装配工站近一个月生产趋势图
              </div>

              <AreaBarChart data={chartData["装配"]} />
            </MagicCard>
          </div>
        </div>
      </div>
      <div className="w-full h-full ">
        <div className="grid grid-cols-3 justify-items-center items-center mt-[4vh]">
          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">焊接工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["钣金"]?.[0]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-4">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className=" text-green-300">
                    {boardData?.["钣金"]?.[0]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className=" text-red-300">
                    {boardData?.["钣金"]?.[0]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">折弯工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["钣金"]?.[1]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["钣金"]?.[1]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["钣金"]?.[1]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">切割工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["钣金"]?.[2]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["钣金"]?.[2]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["钣金"]?.[2]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>
        </div>

        <div className="flex justify-center mt-16">
          <div className="w-[91vw] ">
            <MagicCard className="h-[54vh] before:w-[101%] before:h-[103%]">
              <div className="text-4xl font-medium text-slate-300 text-center mt-6 w-full">
                机加工站近一个月生产趋势图
              </div>

              <AreaBarChart data={chartData["机加工"]} />
            </MagicCard>
          </div>
        </div>
      </div>
      ) : (
      <div className="w-full h-full">
        <div className="grid grid-cols-3 justify-items-center items-center mt-[4vh]">
          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">专机装配工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["其他"]?.[0]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-4">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["其他"]?.[0]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className="text-red-300">
                    {boardData?.["其他"]?.[0]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">样品测试工站</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["其他"]?.[1]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className="text-green-300">
                    {boardData?.["其他"]?.[1]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className=" text-red-300">
                    {boardData?.["其他"]?.[1]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-[24vw] h-[33vh]">
            <div className="w-full h-full text-center">
              <div className="text-4xl mt-4 text-slate-300">委外表面处理1</div>
              <div className="relative flex justify-center mt-8">
                <WavePercent
                  percent={boardData?.["其他"]?.[2]?.percent}
                ></WavePercent>
              </div>
              <div className="text-2xl flex w-full px-6 justify-between absolute bottom-6">
                <span className=" text-slate-300">
                  总生产数量：
                  <span className=" text-green-300">
                    {boardData?.["其他"]?.[2]?.completed}
                  </span>
                </span>
                <span className="text-slate-300">
                  总排产数量：
                  <span className=" text-red-300">
                    {boardData?.["其他"]?.[2]?.qutstanding}
                  </span>
                </span>
              </div>
            </div>
          </MagicCard>
        </div>

        <div className="flex justify-center mt-16">
          <div className="w-[91vw] ">
            <MagicCard className="h-[54vh] before:w-[101%] before:h-[103%]">
              <div className="text-4xl font-medium text-slate-300 text-center mt-6 w-full">
                其他工站近一个月生产趋势图
              </div>

              <AreaBarChart data={chartData["其他"]} />
            </MagicCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrderPage;

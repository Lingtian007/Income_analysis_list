/*
 * @Author: tangyu
 * @Date: 2021-03-15 10:44:21
 * @Company: tangyu1orientsec.com.cn
 * @Description: 
 */
import { h } from "fastman/coreman";
import { debounce } from "common/util/frequencyUtil";
import "./index.scss";
/**
 * 获取涨跌class
 * @param value 判断的值
 */
const getIncomeClass = value => {
  return value > 0 ? "rise" : value < 0 ? "decline" : "";
};
/**
 * 时间格式化成 YYYY-MM-DD
 * @param date
 * @param filter 格式化后显示的日期格式(month: 只显示月，day: 只显示日)
 */
const formattingDate = (date, filter) => {
  if (!date) return "";
  const newDate = date.indexOf("-") > -1 ? date.split("-").join("") : date;
  if (filter === "month") {
    let month = newDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$2");
    return parseInt(month) + "月";
  }
  if (filter === "day") {
    return newDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$3");
  }
  return newDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
};
/**
 * 货币格式化
 * @param value 金额
 * @param showSymbol 是否显示金额前的+ | -
 * @param maxDigits 小数最大长度
 * @param minDigits 小数最小长度
 */
const formatCurrency = ({ value, showSymbol, maxDigits = 20, minDigits }) => {
  if (!isNaN(value)) {
    const symbol = value >= 0 ? "+" : "";
    const formatValue = Number(value).toLocaleString("en-US", {
      maximumFractionDigits: maxDigits
    });
    const splitNumber = formatValue.toString().split(".");
    if (splitNumber.length === 1) {
      splitNumber[1] = "";
    }
    if (minDigits) {
      if (splitNumber[1].length > minDigits) {
        splitNumber[1] = splitNumber[1].substring(0, minDigits);
      } else if (splitNumber[1].length < minDigits) {
        let addZero = "";
        for (let i = 0; i < Number(minDigits - splitNumber[1].length); i++) {
          addZero += "0";
        }
        splitNumber[1] += addZero;
      }
    }
    let returnVal = splitNumber.join(".");
    if (showSymbol) {
      returnVal = symbol + returnVal;
    }
    return returnVal;
  }
  return value;
};
/**
 * 盈亏详情模板
 * @param {*} parmas  参数 (model-数据,actions-方法)
 */
const Detail = parmas => {
  // console.log('===当前 model===', parmas.model);
  const { model, actions } = parmas;
  return (
    <section
      class="page-detail"
      onscroll={debounce(e => actions.watchScroll(e.target), 100)}
    >
      <div class="incomeDetail">
        {/* <h2 class={`incomeDetail__name`}>盈亏分析</h2> */}
        <div class="cumulative-income">
          <h3 class={`cumulative-income__name `}>2020年</h3>
          <div
            class={`cumulative-income__value `}
            onclick={_ => actions.switchBenefits()}
          >
            <span
              class={`${getIncomeClass(model.lastFundincome?.totalIncome)}`}
            >
              {formatCurrency({
                value: !model.lastFundincome?.totalIncome
                  ? "--"
                  : model.lastFundincome?.totalIncome,
                showSymbol: true,
                minDigits: 2
              })}
              <span class="yuan">元</span>
            </span>
            <span id="triangle" class="triangle-up"></span>
          </div>
        </div>
      </div>
      {model.lastFundincome?.list.length && model.isShow && (
        <div class="records">
          <ul>
            {model.lastFundincome?.list.map(data => (
              <li
                class="records__item"
                onclick={() => {
                  actions.router.go("/ProfitLossCycleDetail");
                }}
              >
                <div class="percent">
                  <span class="percent__date">
                    {formattingDate(data.initDate, "month")}
                  </span>
                  <span class="percent__value">
                    {formatCurrency({
                      value:
                        !data.inCome && data.inCome != 0 ? "--" : data.inCome,
                      showSymbol: true,
                      minDigits: 2
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export { Detail };


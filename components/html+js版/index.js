/*
 * @Author: tangyu
 * @Date: 2021-03-15 10:37:10
 * @Company: tangyu1orientsec.com.cn
 * @Description: 
 */
let lastFundincome = {
  totalIncome: "3445",
  list: [
    {
      initDate: "2020-12-01",
      inCome: "100.00"
    },
    {
      initDate: "2020-11-01",
      inCome: "20.00"
    },
    {
      initDate: "2020-10-01",
      inCome: "-10.00"
    },
    {
      initDate: "2020-09-01",
      inCome: "-33.33"
    },
    {
      initDate: "2020-08-01",
      inCome: "0.00"
    },
    {
      initDate: "2020-07-01",
      inCome: "50.00"
    },
    {
      initDate: "2020-06-01",
      inCome: "60.00"
    },
    {
      initDate: "2020-05-01",
      inCome: "-70.00"
    },
    {
      initDate: "2020-05-01",
      inCome: "-80.00"
    },
    {
      initDate: "2020-04-01",
      inCome: "-90.00"
    },
    {
      initDate: "2020-03-01",
      inCome: "100.00"
    },
    {
      initDate: "2020-02-01",
      inCome: "-66.66"
    },
    {
      initDate: "2020-02-01",
      inCome: "90.66"
    },
    {
      initDate: "2020-01-01",
      inCome: "95.66"
    }
  ] // 列表数组
}
let isShow = true // 是否展示盈亏比例
let newList = []
// 收益明细页的滚动容器
let pageContainer = null;
// 收益明细页滚动容器的高度
let pageHeight = 0;
// 收益明细页中所有数据经处理后的描述对象
let fundIncomes = [];
// 收益明细页中所有数据的集合数组
let incomeDoms = [];
// 是否已阅读所有收益明细数据
let allReaded = false;

/**
* 获取涨跌class
* @param value 判断的值
*/
function getIncomeClass(value) {
  return value > 0 ? "rise" : value < 0 ? "decline" : "";
};
/**
* 时间格式化成 YYYY-MM-DD
* @param date
* @param filter 格式化后显示的日期格式(month: 只显示月，day: 只显示日)
*/
function formattingDate(date, filter) {
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
function formatCurrency({ value, showSymbol, maxDigits = 20, minDigits }) {
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
* @param {*} parmas  参数 (model,actions)
*/
function detail() {

  var cent = document.getElementById("ul_list");
  console.log(cent);
  for (var i = 0; i < lastFundincome.list.length; i++) {
    cent.innerHTML += '<li class="records__item" > <div class="percent"><span class="percent__date">'
      + formattingDate(lastFundincome.list[i].initDate, "month") +
      '</span><span class="percent__value">' +
      formatCurrency({
        value: lastFundincome.list[i].inCome,
        showSymbol: true,
        minDigits: 2
      }) + '</span></div></li>'
  }
}
detail()
// 初始化
function init_detail() {
  let list = lastFundincome.list;
  if (!list.length) return;
  allReaded = false;
  let income = [];
  list.map(i => {
    if (i.inCome != 0) {
      income.push(Math.abs(i.inCome));
    }
  });
  // console.log("当前数据 income ", income);
  const maxNumber = Math.max.apply(null, income);
  const minNumber = Math.min.apply(null, income);
  // console.log("当前数据  minNumber", minNumber);
  // 展示长度数组
  const newList = list.map(item => ({
    ...item,
    percent:
      Math.abs(item.inCome) == minNumber ||
        Math.abs(item.inCome) == 0 ||
        Math.abs(item.inCome) <= maxNumber / 3
        ? 0
        : Number(
          (((Math.abs(item.inCome) - maxNumber / 3) / (maxNumber - maxNumber / 3)) * 10 * 62 / 10).toFixed(2)
        )
  }));
  console.log("当前数据 newList ", newList);
  init_benefits(newList);
}
/**
* 收益图表渲染初始化
* newList - 展示长度数组
*/
function init_benefits(newList) {
  setTimeout(() => {
    if (!fundIncomes.length) {
      fundIncomes = Array.from(
        document.querySelectorAll(".records__item .percent")
      );
    }
    // debugger;
    // console.log("当前数据 fundIncomes6666 ", fundIncomes);
    if (!pageContainer) {
      pageContainer = document.querySelector(".page-detail");
      pageHeight = pageContainer.clientHeight;
    }
    incomeDoms = fundIncomes.map((item, index) => {
      return {
        node: item,
        top: item.getBoundingClientRect().top,
        width: newList[index].percent + 38,
        className:
          newList[index].inCome > 0
            ? "percent--rise"
            : newList[index].inCome < 0
              ? "percent--decline"
              : ""
      };
    });
    watchScroll(pageContainer);
  }, 100);
}
/**
* 监听收益明细页的滚动
* @param target 滚动容器的事件对象
*/
function watchScroll(target) {
  if (allReaded) return;
  incomeDoms.forEach((item, index) => {
    // if (target.scrollTop + pageHeight + 64 > item.top) {
    item.node.style.width = `${item.width}%`;
    item.node.className = `percent ${item.className}`;
    if (index === incomeDoms.length - 1) {
      allReaded = true;
    }
    // }
  });
}
/**
* 展示隐藏收益盈亏 列表
*/
function switchBenefits() {
  // 获取三角形元素
  let getTriangle = $("#triangle");
  // 是否存在向上箭头
  if (getTriangle.hasClass("triangle-up")) {
    getTriangle.removeClass("triangle-up");
    getTriangle.toggleClass("triangle-down");

    isShow = false
    // 收益明细页的滚动容器
    pageContainer = null;
    // 收益明细页滚动容器的高度
    pageHeight = 0;
    // 收益明细页中所有数据经处理后的描述对象
    fundIncomes = [];
    // 收益明细页中所有数据的集合数组
    incomeDoms = [];
    // 是否已阅读所有收益明细数据
    allReaded = false;
  } else {
    getTriangle.removeClass("triangle-down");
    getTriangle.toggleClass("triangle-up");
    isShow = true
  }
}
// 初始化收益明细
init_detail()
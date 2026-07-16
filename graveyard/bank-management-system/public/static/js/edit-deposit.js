let contentp;
var customer = document.getElementById("customer");
var account = document.getElementById("account");
var deposit = document.getElementById("deposit");
var total = document.getElementById("total");
var maturedAccount = document.getElementById("m-account");
var withdrawnAccount = document.getElementById("w-account");
var runningAccount = document.getElementById("r-account");
var lastDeposit = document.getElementById("last-deposit");
var lastDepositTime = document.getElementById("last-deposit-time");

async function run2() {
  let result = await fetch("/api/statistics");
  let info = await result.json();

  total.innerText = info.total;
  customer.innerText = info.customer;
  account.innerText = info.accountCount;
  deposit.innerText = info.depositCount;
  maturedAccount.innerText = info.maturedAccountCount;
  withdrawnAccount.innerText = info.withdrawnAccountCount;
  runningAccount.innerText = info.runningAccountCount;
  lastDeposit.innerText =
    
    ": ACN" +
    info.deposits[0].acn +
    " - BDT" +
    info.deposits[0].amount;

  let time = Math.round(
    (Date.now() - new Date(info.deposits[0].date).getTime()) / 1000 / 60
  );

  lastDepositTime.innerText = new Date(info.deposits[0].date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })
  function getAgo() {
    return time == "1" ? "now" : time;
  }
}
run2();

async function editDeposit(params) {
  let res = await fetch("/api/deposit");
  let json = await res.json();
  json.forEach((e, i) => {
    tr.innerHTML += `
                            <form id='dpsEdit-${i}' onsubmit='sendDepositData(this)' action='/api/deposit/test'>
                                <input name='_id' hidden value='${e._id}'>
                                <input name='acn' name='acn' readonly value='${
                                  e.acn
                                }'>
                                <input name='name' readonly value='${e.name}'>
                                <input name='dTo' class='dpsEdit-${i}' readonly type='date' value='${
      e.date.split("T")[0]
    }'>
                                <input name='amount' class='dpsEdit-${i}' readonly value='${
      e.amount
    }'>
                                <button type='button' onclick="removeReadonly('dpsEdit-${i}')"><i class="fa fa-edit fa-fw"></i></button>
                            </form><br>

        `;
  });
  document.getElementById("content").innerHTML = document.getElementById(
    "tr"
  ).innerHTML;
}

function removeReadonly(className) {
  let elements = document.getElementsByClassName(className);
  for (let i = 0; elements.length > i; i++) {
    console.log(elements);
    elements[i].style.border = "1px solid black";
    elements[1].focus();

    elements[i].removeAttribute("readonly");
  }
  elements.innerHTML += `<button type='button'><i class="fa fa-edit fa-fw">fgdf</i></button>`;
}

// if (navigator.userAgent.indexOf('10.3.3') != -1) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function main(url, id) {
  function submitter(_x, _x2) {
    return _submitter.apply(this, arguments);
  }

  function _submitter() {
    _submitter = _asyncToGenerator(function*(url, data) {
      const bc = document.querySelector("#body-content");
      $("#exampleModal").modal("show");
      bc.innerHTML = "<div style='margin-left: 38%;' class='loader'></div>";
      const option = {
        method: "POST",
        body: data
      };

      try {
        const res = yield fetch(url, option);

        if (res.ok) {
          const json = yield res.json();
          if (json.amount)
            return (bc.innerHTML =
              "SUCCESS! Amount Added: " + json.amount + " Taka");
          if (json.acn)
            return (bc.innerHTML = "SUCCESS! Your ACN: " + json.acn);
          if (json.id) return (bc.innerHTML = "SUCCESS! Your ID: " + json.id);
        }

        bc.innerHTML = yield res.text();
      } catch (err) {
        bc.innerHTML = "Error, can't load: " + err;
      }
    });
    return _submitter.apply(this, arguments);
  }

  if (!document.getElementById(id)) return;
  document.getElementById(id).addEventListener("submit", function sender(e) {
    e.preventDefault();
    const formData = new FormData(this);
    submitter(url, formData);
  });
}

main("/api/account", "account-form");
main("/api/customer", "customer-form");
main("/api/deposit", "deposit-form");

// } else {


















//   function main (url, id) {
//   async function submitter (url, data) {
//     const bc = document.querySelector('#body-content');
//     $('#exampleModal').modal('show');
//     bc.innerHTML = "<div style='margin-left: 38%;' class='loader'></div>"
    
//     const option = {method: 'POST', body: data}
//     try {
//       const res = await fetch(url, option);
//       if (res.ok){
//         const json = await res.json();
//         if (json.amount) return bc.innerHTML = 'SUCCESS! Amount Added: ' + json.amount + ' Taka';
//         if (json.acn) return bc.innerHTML = 'SUCCESS! Your ACN: ' + json.acn;
//         if (json.id) return bc.innerHTML = 'SUCCESS! Your ID: ' + json.id;
//       }
//       bc.innerHTML = await res.text();
//     }
//     catch(err) {bc.innerHTML = "Error, can't load: " + err}
//   }
//   if (!document.getElementById(id)) return;
//   document.getElementById(id).addEventListener('submit', function sender(e){
//     e.preventDefault();
//     const formData = new FormData(this);
//     submitter(url, formData)
//     });
//   }
  
//   main('/api/account', 'account-form')
//   main('/api/customer', 'customer-form')
//   main('/api/deposit', 'deposit-form')

// }  

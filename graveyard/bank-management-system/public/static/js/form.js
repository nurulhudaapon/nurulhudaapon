function toggle(checkboxID, toggleID) {
    var checkbox = document.getElementById(checkboxID);
    var toggle = document.getElementById(toggleID);
    updateToggle = checkbox.checked ? toggle.disabled = false : toggle.disabled = true;
}










const accountListContainer = document.querySelector('#account');
document.querySelector('#nav-home-tab').addEventListener('click', getAccounts);
// document.querySelector('#nav-profile-tab').addEventListener('click', getCustomers);

async function getAccounts() {
    const accounts = await fetch('/api/account?type=running');
    const accountList = await accounts.json();
    accountListContainer.innerHTML = '<option hidden selected disabled>Choose account</option>'
    accountList.forEach(element => {
        accountListContainer.innerHTML += `<option>${element.name} - ${element.acn}</option>`
    });
}
async function getAccounts2() {
    const accountEditListContainer = document.querySelector('#account-edit');

    const accounts = await fetch('/api/account?type=short');
    const accountList = await accounts.json();
    accountEditListContainer.innerHTML = '<option hidden selected disabled>Choose account</option>'
    accountList.forEach(element => {
        accountEditListContainer.innerHTML += `<option value=${element.acn}>${element.name} - ${element.acn}</option>`
    });
}
async function getAccounts3() {
    const withdrawAccountListContainer = document.querySelector('#matured-account');

    const accounts = await fetch('/api/account?type=matured');
    const accountList = await accounts.json();
    withdrawAccountListContainer.innerHTML = '<option hidden selected disabled>Choose matured account</option>'
    accountList.forEach(element => {
        withdrawAccountListContainer.innerHTML += `<option value=${element.acn}>${element.name} - ${element.acn}</option>`
    });
}

async function getCustomers() {
    const customerListContainer = document.querySelector('#customer');
    const customers = await fetch('/api/customer');
    const customerList = await customers.json();
    customerListContainer.innerHTML = '<option hidden selected disabled>Choose customer</option>'
    customerList.forEach(element => {
        customerListContainer.innerHTML += `<option>${element.name} - ${element.id}</option>`
    });
}
async function getCustomers2() {
    const customerListContainer = document.querySelector('#customer-edit');
    const customers = await fetch('/api/customer');
    const customerList = await customers.json();
    customerListContainer.innerHTML = '<option hidden selected disabled>Choose customer</option>'
    customerList.forEach(element => {
        customerListContainer.innerHTML += `<option value='${element.id}'>${element.name} - ${element.id}</option>`
    });
}



async function prefillCustomerEdit() {
    const customerId = document.querySelector('#customer-edit').value;
    // console.log(customerId);
    const req = await fetch('/api/customer/' + customerId);
    const customerInfo = await req.json();
    // console.log(customerInfo);

    document.getElementById('name').value = customerInfo.name;
    document.getElementById('address').value = customerInfo.address;
    document.getElementById('phone').value = customerInfo.phone;
    document.getElementById('email').value = customerInfo.email;
    document.getElementById('ccdate').value = customerInfo.date.split('T')[0];
    // console.log(customerInfo.date.split('T')[0]);
    sendEdit('/api/customer/'+document.querySelector('#customer-edit').value, 'customer-edit-form');

}

async function prefillAccountEdit() {
    const acn = document.querySelector('#account-edit').value;
    // console.log(acn);
    const req = await fetch('/api/account/' + acn+'?type=short');
    const accountInfo = await req.json();
    // console.log(accountInfo);

    document.getElementById('name').value = accountInfo.name;
    document.getElementById('acname').value = accountInfo.name;
    document.getElementById('min').value = accountInfo.min;
    document.getElementById('total').value = accountInfo.total;
    document.getElementById('acdate').value = accountInfo.date.split('T')[0];
    // console.log(accountInfo.date.split('T')[0]);
    sendEdit('/api/account/'+document.querySelector('#account-edit').value, 'account-edit-form');


}

function fillName(s, d) {
    document.getElementById(d).value = s.target.value.split(' - ')[0];
    console.log(s.target.value);
    
}

function setCurrentDateTime(id) {
    document.getElementById(id).value = new Date(Date.now()).toISOString().slice(0, -8);
    // console.log(me.value);
}

function toggle(checkboxID, toggleID) {
    var checkbox = document.getElementById(checkboxID);
    var toggle = document.getElementById(toggleID);
    updateToggle = checkbox.checked ? toggle.disabled = false : toggle.disabled = true;
}
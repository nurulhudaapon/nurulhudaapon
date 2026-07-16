let loader = "<div style='margin: 0 auto;' class='loader'></div>"
const bc = document.querySelector('#body-content');
function main(url, id) {
    async function submitter(url, data) {
        $('#exampleModal').modal('show');
        bc.innerHTML = loader
        const option = { method: 'POST', body: data }
        try {
            const res = await fetch(url, option);
            if (res.ok) {
                const json = await res.json();
                console.log(json);
                document.getElementById(id).reset();
                return bc.innerHTML = json.message;
            }
            bc.innerHTML = await res.text();
        }
        catch (err) { bc.innerHTML = "Error, can't load: " + err }
    }
    if (!document.getElementById(id)) return;
    document.getElementById(id).addEventListener('submit', function sender(e) {
        e.preventDefault();
        const formData = new FormData(this);
        submitter(url, formData)
    });
}

main('/api/account', 'account-form')
main('/api/customer', 'customer-form')
main('/api/deposit', 'deposit-form')
main('/api/withdraw', 'withdraw-form')




function sendEdit(url, id) {
    async function editSubmitter(url, data) {
        $('#exampleModal').modal('show');
        bc.innerHTML = loader

        const option = { method: 'PUT', body: data }
        try {       
            const res = await fetch(url, option);
            if (res.ok) {
                bc.innerHTML = 'SUCCES! Information Updated'
            }
        }
        catch (err) { bc.innerHTML = "Error: " + err }
    }
    if (!document.getElementById(id)) return;
    document.getElementById(id).addEventListener('submit', function sender(e) {
        e.preventDefault();
        const formData = new FormData(this);
        editSubmitter(url, formData)

        // console.log(formData);
        
    });
}
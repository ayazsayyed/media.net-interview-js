(() => {
    // Dummy Data
    const emails = [{
        emailId: 'john.doe@gmail.com',
        isEnabled: false,
    },
    {
        emailId: 'jane.doe@gmail.com',
        isEnabled: true
    }];

    renderTable(emails);
    
    // Selectors for DOM Manipulation
    let inputForm = document.querySelector('.input-form')
    let emailInput = document.querySelector('.email-input')
    let searchInput = document.querySelector('.search-input')
    const filterEnable = document.querySelector('.filterEnable')
    const errMsg = document.querySelector('.err-msg')

    // Dynamically append table with given array as param.
    function renderTable(arr) {
        let table = document.querySelector('.table tbody')
        table.innerHTML = ''
        // If no data is present in an array
        if (arr.length <= 0) {
            let row = table.insertRow(),
                emptyCell = row.insertCell(0);
            emptyCell.setAttribute('colspan', 3)
            emptyCell.classList.add('emptyCell')
            emptyCell.innerHTML = 'No Data Available'
        } else {
            arr.forEach(function (email, i) {
                let row = table.insertRow();
                let cell1 = row.insertCell(0),
                    cell2 = row.insertCell(1),
                    cell3 = row.insertCell(2);
                cell1.innerHTML = `<input type="checkbox" class="enable" name="enable" ${email.isEnabled ? 'checked' : ''}>`;
                cell2.innerHTML = `${email.emailId}`;
                cell3.innerHTML = `<i class="fa fa-trash-o delete-email" aria-hidden="true" ></i>`;
                cell2.classList.add('td-email');
                cell2.setAttribute("data-id", i);
            })
        }
    };

    // Error message utility function to display errors based on message as a param.
    let toggleErrorMessage = (msg = '', state = false) => {
        errMsg.innerHTML = msg;
        errMsg.style.display = state ? 'block' : 'none';
    };

    // Email regex validation that returns boolean value.
    let validateEmail = email => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Adding click event listener to dynamically appended element - for delete action
    document.body.addEventListener("click", (e) => {
        if (e.srcElement.classList.contains('delete-email')) {
            let emailIndex = e.target.closest('tr').querySelector('.td-email').getAttribute('data-id')
            emails.splice(emailIndex, 1);
            renderTable(emails)
        };
    });

    // Adding click event listener to dynamically appended checkbox element - for enabling / disabling emails.
    document.body.addEventListener("click", (e) => {
        if (e.srcElement.classList.contains('enable')) {
            let emailIndex = e.target.closest('tr').querySelector('.td-email').getAttribute('data-id')
            emails[emailIndex].isEnabled = !emails[emailIndex].isEnabled;
            renderTable(emails)
        };
    });

    // Adding click event listener to dynamically appended element - for showing only enabled emails.
    filterEnable.addEventListener("click", (e) => {
        if (filterEnable.checked) {
            let enabledEmailList = emails.filter(email => email.isEnabled)
            renderTable(enabledEmailList);
        } else {
            renderTable(emails);
        }
    });

    // Search filter that filters through email id.
    searchInput.addEventListener("keyup", (e) => {
        let filterList = emails.filter(email => email.emailId.toLowerCase().includes(e.target.value.trim().toLowerCase()))
        renderTable(filterList);
    });

    // Form submit function / eventlistener
    inputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!emailInput.value.trim()) {
            toggleErrorMessage('Email is required', true)
            return false
        }
        if (!validateEmail(emailInput.value)) {
            toggleErrorMessage('Please provide a valid email', true);
            return false
        }
        let found = false;
        for (let i = 0; i < emails.length; i++) {
            if (emails[i].emailId === emailInput.value) {
                found = true;
                toggleErrorMessage('Email already exists', true)
                break;
            }
        }
        if (!found) {
            toggleErrorMessage(false)
            emails.push({
                emailId: emailInput.value,
                isEnabled: false
            })
            renderTable(emails);
            emailInput.value = ''
        }
    });
})();
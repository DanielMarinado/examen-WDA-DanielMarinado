const toastOkMsg = (word) => {
    Toastify({
        text: word,
        duration: 4000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
}

const toastErrMsg = (msg) => {
    Toastify({
        text: msg,
        duration: 2000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)"
        }
    }).showToast();
}

const toastWarnMsg = (msg) => {
    Toastify({
        text: msg,
        duration: 4000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(253,85,29,1) 48%, rgba(252,176,69,1) 100%)"
        }
    }).showToast();
}
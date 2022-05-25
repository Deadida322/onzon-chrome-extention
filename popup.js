let active = false

function getCurrentTabUrl() {
    let queryInfo = {
        active: true,
        currentWindow: true
    };
    let result = ''
    chrome.tabs.query(queryInfo, (tabs) => {
        let tab = tabs[0];
        let url = tab.url;

        if (url == 'https://seller.ozon.ru/app/products/add/common-attrs') {
            active = true
            document.getElementById('off').classList.add('d-none')
        }
        else{
            document.getElementById('on').classList.add('d-none')
        }
    });
    return result

}


getCurrentTabUrl()

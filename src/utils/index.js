export function sortArrByDateKey(arr,dateKey){
    return arr.sort((a,b) => {
        let aDate = new Date(a[dateKey]);
        let bDate = new Date(b[dateKey]);
        return +aDate - +bDate;
    })
}


export function getNumberOfDays(start, end){
    const date1 = new Date(start); 
    const date2 = new Date(end); 
    const oneDay = 1000 * 60 * 60 * 24; 
    const diffInTime = date2.getTime() - date1.getTime(); 
    const diffInDays = Math.round(diffInTime / oneDay); 
    return diffInDays;
}


export function formatDate(str){
    const d = new Date(str);
    return `${d.getFullYear()}/${formatToDecimal(d.getMonth() + 1)}/${formatToDecimal(d.getDate())}`
}


function formatToDecimal(n){
    if(+n < 10){
        return `0${n}`;
    } else {
        return n;
    }
}


export function isToday(date){
    const today = new Date();
    if(date.getFullYear() === today.getFullYear()){
        if(date.getMonth() === today.getMonth()){
            if(date.getDate() === today.getDate()){
                return true;
            }
        }
    }
    return false;
}
// Date.prototype.format = function() {
//     var s = '';
// // 　　var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
// 　　var mouth = this.getMonth() + 1;
// // 　　var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
// 　　var day = this.getDate();
// 　　s += this.getFullYear() + '-'; 
// 　　s += mouth + "-"; 
// 　　s += day; 
// 　　return (s); 
// };
export default {
    mergeArr(arr,n){
        const newArr=[];
        var temp = {};
        for(let i in arr) {
            var key = arr[i][n];
            if(temp[key]) {
                // temp[key][n] = temp[key][n];
                for(let j in arr[0]){
                    if(j !== n){
                        temp[key][j] = temp[key][j] + arr[i][j];
                    }
                }
            } else {
                temp[key] = {};
                for(let j in arr[0]){
                    temp[key][j] = arr[i][j];
                }
            }
        }
        for(let k in temp){
            newArr.push(temp[k])
        }
        return newArr
    },
    forwardRankingDate(data, p) {
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data.length - 1 - i; j++) {
                if (Date.parse(data[j][p]) > Date.parse(data[j+1][p])) {
                    let temp = data[j];
                    data[j] = data[j + 1];
                    data[j + 1] = temp;
                }
            }
        }
        return data;
   },
   getAllDate(begin, end) {
        var arr=[];
        var ab = begin.split("-");
        var ae = end.split("-");
        var db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        var de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
        var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
        for (var k = unixDb; k <= unixDe;) {
        //console.log((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).format());
        }
        return arr;
    },
    getDay(day){
    　　var today = new Date();
    　　var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    　　today.setTime(targetday_milliseconds); 
    　　var tYear = today.getFullYear();
    　　var tMonth = today.getMonth();
    　　var tDate = today.getDate();
    　　tMonth = this.doHandleMonth(tMonth + 1);
　　    tDate = this.doHandleMonth(tDate);
    　　return tYear+"-"+tMonth+"-"+tDate;
    },
    doHandleMonth(month){
    　　var m = month;
    　　if(month.toString().length == 1){
    // 　　　　m = "0" + month;
    　　　　m = month;
    　　}
    　　return m;
    },
    formateResponseData(responseDataDaily,dayNum){
        const dateList = this.getAllDate(this.getDay(-dayNum),this.getDay(0));
        let data = [];
        let dataSave = [];
        // responseDataDaily.map((item)=>{ item.date = item.date.match(/\/(\S*)/)[1]});
        responseDataDaily.forEach((item)=>{
            if(dateList.includes(item.date)){
            dataSave.push(item);
            }
        });
        if(dataSave.length > 0){
            dateList.forEach((date,key)=>{

            if( dataSave.some((item)=>item.date === date))
                data[key] = dataSave.filter((item)=>item.date === date)[0];
            else{
                const obj = dataSave[0];
                for(let key in obj){
                    obj[key] = 0;
                }
                data[key] = obj

            }
            });
        }
        return data
    }
}
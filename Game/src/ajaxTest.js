/**
 * Created by L on 2016/4/27.
 */
var outJson;
var score;
var times;
$.ajax({
    type: "GET",
    url: "http://120.26.54.131:8080/pricetag/selects",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(outJson),
    dataType: "json",
    success: function (json) {
        alert("数据：" + json.code);
        score = 5;
        times = 2;
    },
    error: function (message) {

    }
});




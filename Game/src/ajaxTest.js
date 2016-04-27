/**
 * Created by L on 2016/4/27.
 */
$.ajax({
    //接口地址
    url:'http://120.26.54.131:8080/pricetag/selects',
    //请求方式
    type:'GET',
    //返回数据类型
    dataType:'json',
    //请求失败时处理方式
    error:function(){},
    //请求成功时处理方式
    success:function(result){
        if(result.code == 1){
            //将从接口返回的数据拼装html语句
            html = '';
            $.each(result.data,function(key,value){
                html +='<li><a href="##">+value.title+</li>';
            });
            //即使请求了生成的静态news.htmls文件，静态new.htmls文件jq也会动态将数据到静态news.htmls静态文件中
            $("#hot_html").html(html);
        }else{
            //todo
        }
    },
});

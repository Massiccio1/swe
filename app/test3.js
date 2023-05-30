function custom_http2(method, custom_data){
    let url = "https://tutor-me.onrender.com";
    request({
        url: url,
        method: method,
        json: {"request": custom_data.body},
    }, function (error, response, body) {
         if (!error && response.statusCode === 200) {
             console.log(body)
         }
         else {
    
             console.log("error: " + error)
             console.log("response.statusCode: " + response.statusCode)
             console.log("response.statusText: " + response.statusText)
         }
     })
}
const test3 =  custom_http2("GET",{
    hostname: 'https://tutor-me.onrender.com',
    path: `/`,
    body: JSON.stringify({
        email:"1@gmail.com"
    })
});
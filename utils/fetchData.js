import sign from "jwt-encode";
async function fetchData(url,method,body,contentType,setIsLoading){
    let requestBody = null;
    switch (method) {
        case "GET":
            requestBody = null;
            break;
        case "PUT":
            requestBody=JSON.stringify({body:sign(body,import.meta.env.VITE_SECRET_KEY)})
            break;
        case "DELETE":
            requestBody = null;
            break;
        case "POST":
            requestBody=JSON.stringify({body:sign(body,import.meta.env.VITE_SECRET_KEY)})
            break;
    }
    try {
        setIsLoading(true);
        let request = await fetch(import.meta.env.VITE_REQUEST_URL+url,{
            body:requestBody,
            method,
            credentials:"include",
            headers:{
                "Content-Type":contentType=="json"?"application/json":"multipart/form-data",
                "Set-Cookie":`json_token=${document.cookie?.json_token}`,
                "Cache-Control":"no"
            }
        })
        let response;
        if(contentType=="json"){
            response = await request.json();
        }else{
            response = await request.blob();
        }
        return response;
    } catch (error) {
        console.log(error);
    }finally{
        setIsLoading(false);
    }
}
export {fetchData}
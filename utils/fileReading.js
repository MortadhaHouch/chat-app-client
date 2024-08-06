export default function fileReading(file){
    return new Promise((res,rej)=>{
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load",function(){
            res(fileReader.result);
        })
        fileReader.addEventListener("error",function(){
            rej("Error loading file");
        })
    })
}
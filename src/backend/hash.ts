export function random(len:number){
    let result = '';
    let option = 'qwertyuiopsfahklmnbvxcfzzxzbdsfouihsakjfhc';
    for(let i=0; i<len; i++){
        result+= option.charAt(Math.floor(Math.random() * option.length))
    }
    return result ;
}
// const ans = random(10);
// console.log("ans - " +ans);
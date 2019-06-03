/**
 *   Create by Malson on 2018/8/20
 */


let Utils = {
  //change 度  to 度分
  ChangeToDFM:function (val) {
    let str1 = val.split(".");
    let du1 = str1[0];
    let tp = "0."+str1[1]
    tp = new String(tp*60);		//这里进行了强制类型转换
    let str2 = tp.split(".");
    let fen =str2[0];
    tp = "0."+str2[1];
    tp = tp*60;
    let miao = parseInt(tp);
    let reternVal = du1+"°"+fen+"'"+miao+"\"";
    return reternVal;
  }
};
export default Utils;
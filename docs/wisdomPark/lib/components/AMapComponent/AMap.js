/**
 *   Create by Malson on 2018/8/16
 */
//高德地图  API  采用的是异步调用  相比直接用react-amp 有效的减少打包文件体积

import React from 'react';
import PropTypes from 'prop-types';
import { Input,Modal,Button,Spin } from 'antd';
import './aMap.scss';

//定义变量
var mapComponent;
let marker,//设置点
    geocoder;//编码


class AMapComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      lastPosition:'',
      btnLoading:false
    }
  }
  componentWillMount(){
    mapComponent && this.destroyMap();
  }
  componentDidMount(){
    if(document.querySelector("#aMap")){
      this.initMap();
      return;
    }
    window.init = ()=>{
      this.initMap();
    };
    let script = document.createElement('script');
    script.setAttribute("type","text/javascript");
    script.setAttribute("id","aMap");
    script.setAttribute("src","https://webapi.amap.com/maps?v=1.4.8&" +
        "key=af3861d1a4996ee7827c1292b1191ff5&callback=init" +
        "&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.ToolBar,AMap.Geocoder");
    document.getElementsByTagName('body')[0].appendChild(script);
  }
  //添加点
  addMarker(position){
    marker = new AMap.Marker({
      icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: position,
      draggable: true,
      cursor: 'move',
      animation:'AMAP_ANIMATION_DROP'
    });
    marker.setMap(mapComponent);
    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
      offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
      content: position
    });
    mapComponent.setCenter(position);//平移地图中心点
    
    //鼠标点击  离开
    marker.on('mouseup',(e)=>{
      let lastPosition = [e.lnglat.lng,e.lnglat.lat];
      this.setState({lastPosition});
      marker.setLabel({
        offset: new AMap.Pixel(20, 20),
        content: lastPosition
      });
    })
  }
  //地理编码,返回地理编码结果
  searchPosition(positionVal){
    let $this = this;
    geocoder.getLocation(positionVal, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
        //返回N个结果，取第一个再自行调整
        let resultDate = result.geocodes[0];
      
        //maker 点
        if(marker){
          mapComponent.remove(marker);
        }
        let lastPosition = [resultDate.location.lng,resultDate.location.lat];
        $this.addMarker(lastPosition);
        $this.setState({lastPosition,btnLoading:false});
      }else{
        $this.setState({lastPosition:'获取错误',btnLoading:false});
      }
    });
  }
  initMap(){
    mapComponent = new AMap.Map('aMapContainer',{
      resizeEnable: true,
      zoom:15
    });
    
    geocoder = new AMap.Geocoder({
      city: "", //
      radius: 1000 //范围，默认：500
    });

    //搜索选址
    let autoOptions = { input: "tipinput" };
    let auto = new AMap.Autocomplete(autoOptions);
    AMap.event.addListener(auto, "select", (e)=>this.searchPosition(e.poi.name));//注册监听，当选中某条记录时会触发

    //开始搜索
    this.searchInit();
  }
  searchInit(){
    let propsName = this.props.defaultVal;
    this.searchPosition(propsName);
  }
  search=()=>{
    this.setState({btnLoading:true});
    let val = this.searchInput.input.value;
    this.searchPosition(val);
  }
  destroyMap(){
    mapComponent.destroy();
  }
  render(){
    let defaultVal = this.props.defaultVal;
    return(
        <div style={{marginTop:-12}}>
          <Spin  spinning={!this.state.lastPosition}>
            <div className='map-table'>
              <label>关键词查询：</label>
              <Input id="tipinput" defaultValue={ defaultVal } ref={ref=>this.searchInput=ref}  style={{width:180}}/>
              <Button style={{marginLeft:10}} loading={this.state.btnLoading} onClick={this.search}>查询</Button>
              <label className='lng-lat-posi'>经纬度：{this.state.lastPosition.toString()}</label>
            </div>
            <div className='map-wrap'>
              <div id='aMapContainer'/>
            </div>
          </Spin>
        </div>
    )
  }
}
//必须要传初始地址
AMapComponent.propTypes = {
  defaultVal: PropTypes.string,
};

export default AMapComponent;
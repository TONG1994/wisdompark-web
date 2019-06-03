import React from 'react';
import classNames from 'classnames';
import { Cascader } from 'antd';
/**
 *  props 传入onchange接受回调
*/
import AreaActions from '../action/AreaActions';
import AreaStore from '../store/AreaStore';
class AreaPosition extends React.Component{
  constructor(props){
    super(props);
    this.state={
      options:[]
    }
  }
  componentDidMount(){
    this.getAddressFun = AreaStore.listen(this.getAddress);
    if(window.sessionStorage.address){
      let options=[];
      try {
        options = JSON.parse(window.sessionStorage.address);
      }catch (err){}
      this.setState({options});
      return;
    }
    AreaActions.getAddressData();
  }
  getAddress = (data)=>{
    if(data.operation==='getAddress'){
      let options = data.recordSet[0];
      this.setState({options});
      window.sessionStorage.address = JSON.stringify(options);
    }
  }
  componentWillUnmount(){
    this.getAddressFun();
  }
  render(){
    let val = this.props.value?this.props.value.split(','):'';
    return(
        <Cascader
            options={this.state.options}
            value={val}
            onChange={this.props.onChange}
            placeholder="-请选择 -" size="large"
            disabled = {this.props.disabled}
        />
    )
  }
}
export default AreaPosition;
import React from 'react';
import { DatePicker , Input , Select } from 'antd';
import '../style/index.scss';
import moment from 'moment';
const Option = Select.Option;
const Search = Input.Search;
const { RangePicker } = DatePicker;

//  let date=moment(Date.now()).format('YYYY-MM-DD').valueOf();

 class Filter extends React.Component{

  constructor(){
    super();
    this.state={
      filterSet:{},
      placeholder: '请输入操作账号名称',
    };
  }

  componentDidMount(){
    this.setState({
      filterSet:{
        selectValue: 'accountName',
      }
    })
  }

  handleChange=(dateValue)=>{
    console.log(dateValue);
    let filterSet=Object.assign({},this.state.filterSet,{ startValue: dateValue[0], endValue: dateValue[1]});
    this.setState({ filterSet });
  }

  onSelected = (selectValue) =>{
    let filterSet=Object.assign({},this.state.filterSet,{ selectValue });
    this.setState({ filterSet });
  }

  Search = (searchValue) =>{
    let filterSet=this.state.filterSet;
    filterSet.searchValue=searchValue;
    this.props.onChange(filterSet);
    
  }

  render(){
    const { dateValue , selectValue} = this.state.filterSet;
    return (
      <div className="filter-main">
        <div className="filter-tag1">
          <RangePicker 
            className='btn-margin' 
            format='YYYY-MM-DD'
            style={{width:'230px',textAlign:'center'}} 
            onCalendarChange={this.onCalendarChange}
            onChange={this.handleChange}
          />
        </div>
        <div className="filter-tag2">
            {/* 选择框 */}
            <Select value={selectValue} style={{ width: '100px'}} onSelect={this.onSelected}>
              <Option value="accountName">操作账户</Option>
              <Option value="moduleName">操作模块</Option>
              <Option value="operation">操作类型</Option>
            </Select>
            {/* 查询框 */}
            <Search 
              style={{ width: '200px',marginLeft:'10px'}}
              placeholder={this.state.placeholder}
              onSearch={this.Search}
            />
        </div>
      </div>
      
    );
  }

 }
 export default Filter;

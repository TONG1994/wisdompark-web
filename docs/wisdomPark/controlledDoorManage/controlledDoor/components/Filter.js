/**
 *   Create by Malson on 2018/4/26
 */

import React from 'react';
import { Form,Col,Row,DatePicker } from 'antd';

import ModalForm from '../../../../lib/Components/ModalForm';
import DictSelect from '../../../../lib/Components/DictSelect';
const {RangePicker } = DatePicker;
const FormItem = Form.Item;
import moment from 'moment';
let ExpressFilter = React.createClass({
  getInitialState: function () {
    return {
      modal: this.props.moreFilter,
      hints: {},
      validRules: [],
      filter: {
        logisticsCompanyUuid:''
      },
    }
  },

  mixins: [ModalForm('filter', true)],
  componentWillReceiveProps: function (newProps) {
    this.setState({
      modal: newProps.moreFilter,
    });
  },

  // 第一次加载
  componentDidMount: function () {
    this.clear();
  },
  clear:function(){
    this.forceUpdate();
  },
  onChange:function(date, dateString){

    this.state.filter.createTimeFrom=dateString[0];
    this.state.filter.createTimeTo=dateString[1];
    //this.state.filter.orderStatus=4;
    this.setState({loading:false});
  },
  disabledDate:function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  },

  render: function () {
    return (
        <div className='filter-wrap'>
          我是大叔大婶大师大师傅3我前端弯曲度弯曲度请问大青蛙点玩去
        </div>
  );
  }
});

module.exports = ExpressFilter;
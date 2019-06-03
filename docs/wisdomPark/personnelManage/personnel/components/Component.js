import React from 'react';
import {Input} from 'antd';

let XXXX = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    return (
        <Input type='text' name='name' id='name' placeholder='输入公司名称' size='large'/>
    );
  }
});

module.exports = XXXX;
/**
 *   Create by Malson on 2018/7/24
 */

import React from 'react';
import {Select} from 'antd';

let XXXX = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    return (
        <Select size='large' value="">
          <Option value=""> -- </Option>
          <option value="4">4楼</option>
          <option value="5">5楼</option>
        </Select>
    );
  }
});

module.exports = XXXX;
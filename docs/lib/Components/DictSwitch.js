import React from 'react';
var Utils = require('../../public/script/utils');

import { Switch } from 'antd';

var DictSwitch = React.createClass({
    getInitialState: function () {
        return {
            loading: false
        };
    },

    onSwitchChange: function (data) {
        const {
            checked,
            unChecked,
            onChange,
        } = this.props;

        if (onChange) {
            var value = data ? checked.value : unChecked.value;
            onChange(this.props.id, value);
        }
    },
    render: function () {
        const {
            checked,
            unChecked,
            id,
            value,
            onChange,
            ...attributes
        } = this.props;

        // console.log(checked, unChecked, value)
        var data = (checked.value === value) ? true : false;
        return <Switch id={id} name={id} checked={data} checkedChildren={checked.title} unCheckedChildren={unChecked.title} onChange={this.onSwitchChange} {...attributes} />;
    }
});

export default DictSwitch;

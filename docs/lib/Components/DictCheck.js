import React from 'react';
var Utils = require('../../public/script/utils');

import { Checkbox, Spin } from 'antd';
const CheckboxGroup = Checkbox.Group;

const verticalStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};
var DictCheck = React.createClass({
    getInitialState: function () {
        return {
            opts: [],
            loading: false
        };
    },

    showOptions: function (opts) {
        var values = opts.codeData;
        if (values === null || typeof (values) === 'undefined') {
            values = [];
        }

        this.setState({
            opts: values,
            loading: false
        });
    },
    componentWillMount: function () {
        const {
            appName,
            optName,
        } = this.props;

        this.state.loading = true;
        Utils.loadOptions(appName, optName, this.showOptions);
    },
    render: function () {
        const {
            appName,
            optName,
            showCode,
            layout,
            checkStyle,
            id,
            value,
            ...attributes
        } = this.props;

        var rStyle = checkStyle;
        if (layout === 'vertical') {
            if (rStyle === null || typeof (rStyle) === 'undefined') {
                rStyle = verticalStyle;
            }
        }

        var opts;
        if (showCode) {
            opts = this.state.opts.map((item, i) => {
                var label = (item.codeDesc !== item.codeValue) ? item.codeValue = '-' + item.codeDesc : item.codeDesc;
                return { value: item.codeValue, label: label };
            });
        }
        else {
            opts = this.state.opts.map((item, i) => {
                return { value: item.codeValue, label: item.codeDesc };
            });
        }

        var values = [];
        if (value && value !== '') {
            values = value.split(',');
        }

        // console.log(values, opts)
        var obj = <CheckboxGroup id={id} options={opts} value={values} {...attributes} />;
        return this.state.loading ? <Spin>{obj}</Spin> : obj;
    }
});

export default DictCheck;

/**
 * Data source driven component.
 *
 * @author: Andy
 * @time: 2017-06-28
 */

import './index.css';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Form, Select, Input, Row, Col, Radio, DatePicker} from 'antd';
const FormItem   = Form.Item;
const Option     = Select.Option;
const RadioGroup = Radio.Group;

class Autonomous extends Component{
    constructor (props) {
        super(props);
        // Binding `this`.
        this.genRows = this.genRows.bind(this);
    }

    // Generate each row.
    genRows () {
        const _this = this;
        const { matrix, fields } = _this.props.data;
        return matrix.map( (row, ridx) => {
            // decide each column's span by column's count.
            let undefinedCount = 0;
            let remain = 24;
            let cols = row.map( col => {
                let f = fields[col];
                if( !f || !f.span ) {
                    undefinedCount += 1;
                    return undefined;
                } else {
                    remain -= f.span;
                    return f.span;
                }
            });
            let defaultSpan = remain / undefinedCount;
            cols = cols.slice().map( c => c ? c : defaultSpan );
            
            return <Row key={ridx}>{
                row.map( (col, cidx) => <Col span={cols[cidx]} key={cidx}>{
                    _this.genCol(col)
                }</Col> )
            }</Row>
        } );
    }

    // Generate each column.
    genCol (col) {
        if (!col) return <span></span>;

        const _this = this;
        const { fields } = _this.props.data;
        const field = fields[col];
        const formItemLayout = field.layout ? 
            { labelCol: {span: field.layout[0]}, wrapperCol: {span: field.layout[1]} } :
            { labelCol: {span: 8}, wrapperCol: {span: 16} };
        const visible = (('visible' in field) && !field.visible) ? 'hidden' : 'visible';

        return (
            <FormItem 
                {...formItemLayout} 
                label={field.label} 
                className={field.required ? 'form-item-required' : ''}
                style={{visibility: visible}
            }>{
                field.children ?
                <Row>{
                    field.children.map( (child, idx) =>
                        <Col key={idx} span={fields[child].span}>
                            <FormItem>{_this.genDecoratedField(child)}</FormItem>
                        </Col> )
                }</Row> : _this.genDecoratedField(col)
            }</FormItem>
        )
    }

    // Generate antd decorated fiels.
    genDecoratedField (id) {
        const _this = this;
        const { getFieldDecorator } = _this.props.form;
        const field = _this.props.data.fields[id];
        const { events, attrs } = field;
        let el = null;
        let evts = {};

        // Combine each event handler into `evts`, to pass to antd's data entry components.
        if (events) {
            for (let [k, v] of Object.entries(events)) {
                evts[`on${k.charAt(0).toUpperCase() + k.slice(1)}`] = v.bind(_this);
            }
        }

        // Decide which componet to display.
        switch (field.type) {
            case 'input':
                el = <Input {...evts} {...attrs}/>
                break;
            case 'select':
                el = <Select {...evts} {...attrs}>
                    {field.options.map((opt, idx) => <Option value={opt.itemNo} key={idx}>{opt.itemName}</Option>)}
                </Select>
                break;
            case 'radio':
                el = <RadioGroup {...evts} {...attrs}>
                    {field.options.map((opt, idx) => <Radio value={opt.itemNo} key={idx}>{opt.itemName}</Radio>)}
                </RadioGroup>;
                break;
            case 'datePicker':
                el = <DatePicker {...evts} {...attrs}/>
                break;
            case 'custom':
                el = field.markup;
                break;
            default:
                break;
        }

        // Wrap each field with antd decorator to achive bi-directional data binding.
        return getFieldDecorator(id, field.decorator)(el);
    }

    render () {
        const capStyle = {margin: '20px'};
        return (
            <div>
                <Form>
                    <Row><h2 style={capStyle}>{this.props.data.caption}</h2></Row>
                    {this.genRows()}
                </Form>
            </div>
        )
    }
}

// Typechecking With PropTypes.
Autonomous.propTypes = {
    data: PropTypes.shape({
        caption: PropTypes.string.isRequired,
        fields: PropTypes.object.isRequired,
        matrix: PropTypes.arrayOf(PropTypes.array).isRequired
    }),
    onUpdate: PropTypes.func.isRequired
}

Autonomous = Form.create({
    mapPropsToFields: function (props) {
        return props.data.fields
    }
})(Autonomous);

module.exports = Autonomous;

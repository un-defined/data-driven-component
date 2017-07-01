/**
 * Demo data source
 * 
 * @author: Andy
 * @time: 2017-06-28
 */

import React from 'react';
import {Input} from 'antd';
// `updateSource` func should be imported by every data source.
import {updateSource} from '../Autonomous/utils';

export default {
    caption: '联系人信息',
    fields: {
        'workContactPerson': {
            label: '失去焦点校验', 
            decorator: {
                validateTrigger: 'onBlur',
                rules: [
                    {required: true, message: '请写点儿东西吧大爷'}
                ]
            },
            type: 'input',
            value: ''
        },
        'workRelationShip': {
            label: '禁用',
            type: 'input',
            attrs: {
                disabled: true
            },
            value: ''
        },
        'coTel': {
            label: '带多个子组件',
            type: 'input',
            children: ['corpArea', 'workTel', 'corpExtension']
        },
        'corpArea': {
            span: 6,
            type: 'input',
            value: ''
        },
        'workTel': {
            span: 9,
            type: 'input',
            value: ''
        },
        'corpExtension': {
            span: 9,
            type: 'input',
            attrs: {
                addonAfter: <span>X</span>,
            },
            value: ''
        },
        'testSelect': {
            label: '下拉列表',
            type: 'select',
            options: [{
                itemNo: '1',
                itemName: '11111'
            },{
                itemNo: '2',
                itemName: '22222'
            }]
        },
        'testCustom': {
            label: '自定义',
            type: 'custom',
            markup: <Input/>
        },
        'related': {
            label: '关联组件',
            type: 'select',
            options: [{
                itemNo: '1',
                itemName: '显示'
            },{
                itemNo: '2',
                itemName: '隐藏'
            }],
            events: {
                change: function(val) {
                    this.props.form.setFieldsValue({ 'related': val });
                    updateSource.call(this, 'target', function(field){
                        field.visible = val == '1';
                    })
                }
            },
            value: '1'
        },
        'target': {
            label: '目标元素',
            type: 'input',
            value: '' 
        }
    },
    matrix: [
        ['workContactPerson', 'workRelationShip', 'coTel', 'testSelect'],
        ['related', 'target', null, null],
        ['testCustom', null, null, null],
    ]
}


// Field object description.
// {
//     label:     {String}      字段名(optional),
//     type:      {String}      组件类型(required),
//     options:   {Object[]}    下拉选项(optional), 当且仅当 type === 'select' 必填
//     events:    {Object}      事件集合(optional),
//     markup:    {JSX}         jsx元素(optional), 当且仅当 type === 'custom' 必填
//     children:  {String[]}    子元素(optional), 字段由多个子组件组成时提供
//     decorator: {Object}      antd 修饰方法参数(optional), 参见
//                              https://ant.design/components/form-cn/#getFieldDecorator(id,-options)-参数
//     attrs:     {Object}      标签属性(optional), 参考 antd 各组件属性写法
//     value:     {Any}         该字段的值(required)
// }
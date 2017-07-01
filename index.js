import React, {Component} from 'react';
import {Button} from 'antd';
import Autonomous from './Autonomous';
import profile from './data/profile';

class AutoPage extends Component{
    constructor (props) {
        super(props);
        this.state = {
            profile
        }
    }
    handleClick () {
        let p =  this.refs.profile.getFieldsValue();
        console.log( p )
    }
    handleUpdate (type, newData) {
        this.setState({[type]: newData});
    }
    render () {
        return (
            <div>
                <Button onClick={this.handleClick.bind(this)}>Get fields</Button>
                <Autonomous
                    ref="profile"
                    data={ this.state.profile }
                    onUpdate={this.handleUpdate.bind(this, 'profile')}
                />
            </div>
        );
    }
};

module.exports = AutoPage;
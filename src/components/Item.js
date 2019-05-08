import React, {Component} from 'react';
import './Item.css';
import Button from './Button'

export default class Item extends Component {
    render() {
        return (
            <div
                onClick={this.props.onEdit} key={this.props.id} 
                className={this.props.valid ? 'item green' : 'item red'}>
                <div className='left'>    
                    <span className='item-name'>{this.props.name}</span>
                    <span className='item-description'>{this.props.description}</span>
                </div>            
                <div className='right'>
                    <Button onClick={this.props.onDelete} value='Delete'/>
                </div>
            </div>
        )
    }
}
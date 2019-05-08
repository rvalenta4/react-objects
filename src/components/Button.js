import React from 'react';
import './Button.css';

const Button = props => (
    <input type='button' className='btn' disabled={props.disabled}
        onClick={props.onClick} value={props.value}/>
)

export default Button
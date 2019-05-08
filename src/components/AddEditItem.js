import React from 'react';
import './AddEditItem.css';

const AddEditItem = props => (
    <div className='add-item'>
        <input 
            type='text' onChange={props.onChange} 
            name='name' className='text-input' 
            value={props.name} placeholder='Name'/>
        <input 
            type='text' onChange={props.onChange} 
            name='description' className='text-input'
            value={props.description} placeholder='Description'/>
        <select 
            onChange={props.switchValid}
            value={props.valid ? 'valid' : 'invalid'}>
            <option value='valid'>valid</option>
            <option value='invalid'>invalid</option>
        </select>
    </div> 
)

export default AddEditItem
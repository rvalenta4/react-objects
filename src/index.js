import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Button from './components/Button'
import Item from './components/Item'
import AddEditItem from './components/AddEditItem'
import axios from 'axios'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            name: '',
            description: '',
            valid: true,            
            edit: false,
            editId: null,
            sortBy: 'name'
        }
    }

    componentDidMount() {
        axios.get('https://react-objects.firebaseio.com/state.json')
            .then(response => this.setState({...response.data}))
            .catch(error => console.log(error))
    }    
    
    put = () => {
        const putData = {items: this.state.items, sortBy: this.state.sortBy}

        axios.put('https://react-objects.firebaseio.com/state.json', putData)
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }

    handleKeyPress = (e) => {        
        if (!this.state.edit && e.keyCode === 13) {
            e.preventDefault()
            this.addNewItem()
        } else if (this.state.edit && e.keyCode === 13) {
            e.preventDefault()
            this.updateItem()
        }
    }

    switchValid = () => this.setState({valid: !this.state.valid})
    
    addNewItem = () => {
        const {items, name, description, valid} = this.state

        let ids = []

        for(let i = 0; i < items.length; i++) ids.push(items[i].id)
        
        const newItem = {
            id: items.length === 0 ? 0 : Math.max(...ids) + 1,
            name: name,
            description: description,
            valid: valid
        };
        
        if (this.state.name !== '' && this.state.description !== '') {
            this.setState((prevState) => ({
                items: prevState.items.concat(newItem),
                name: '',
                description: '',
                valid: true,
                sortBy: null
            }), () => this.put());
        }
    }

    handleTextBoxChange = (e) => this.setState({[e.target.name]: e.target.value})
    
    editItem = (itemId) => {        
        const {items} = this.state
        const editedItem = items[items.findIndex(item => item.id === itemId)] 

        this.setState({
            name: editedItem.name,
            description: editedItem.description,
            valid: editedItem.valid,
            edit: true,
            editId: itemId
        });        
    }

    updateItem = () => {
        const {items, editId, name, description, valid} = this.state

        const updatedList = items.map((item) => {
            if(item.id === editId) {
                return {
                    id: item.id,
                    name: name, 
                    description: description, 
                    valid: valid
                }             
            } else return item
        });

        if(this.state.name !== '' && this.state.description !== '') {
            this.setState({
                items: updatedList,
                name: '',
                description: '',
                edit: false,
                editId: null,
                valid: true,
                sortBy: null
            }, () => this.put())
        }
    }

    cancelEdit = () => {
        this.setState({
            name: '',
            description: '',
            edit: false,
            valid: true,
            editId: null
        });
    }

    deleteItem = (itemId) => {
        if(this.state.edit) this.cancelEdit()     
        let newItems = [...this.state.items]
        newItems.splice(newItems.findIndex(item => item.id === itemId), 1)
        this.setState({items: newItems}, () => this.put())
    }

    sortItems = (sortBy) => {
        let sortedItems = [...this.state.items]

        if(sortBy === 'name' || sortBy === 'description') {
            sortedItems.sort((a, b) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() 
                ? 1 : (b[sortBy].toLowerCase() > a[sortBy].toLowerCase() 
                    ? -1 : 0))
        } else if (sortBy === 'valid') {
            sortedItems.sort((a, b) => a[sortBy] < b[sortBy] 
                ? 1 : (b[sortBy] < a[sortBy]
                    ? -1 : 0))
        }
            
        this.setState({items: sortedItems, sortBy: sortBy}, () => this.put())
    }

    render() {
        
        const itemList = this.state.items.map((item) => 
            <Item valid={item.valid} key={item.id} name={item.name} description={item.description} 
                onEdit={()=>{this.editItem(item.id)}} onDelete={()=>{this.deleteItem(item.id)}}/>            
        );
        
        return (
            <div className='app' onKeyDown={(e) => this.handleKeyPress(e)}>

                <h1>Items</h1>

                <AddEditItem
                    switchValid={() => this.switchValid()} 
                    onChange={(e)=> this.handleTextBoxChange(e)}
                    name={this.state.name}
                    valid={this.state.valid} 
                    description={this.state.description}/>

                {!this.state.edit 
                    ? <Button 
                        onClick={() => this.addNewItem()} value='Add' 
                        disabled={!this.state.name || !this.state.description}/> 

                    : <Button 
                        onClick={() => this.updateItem()} value='Update'
                        disabled={!this.state.name || !this.state.description}/>}

                {this.state.edit && <Button onClick={this.cancelEdit} value='Cancel'/>}

                {itemList}

                <h4>Sort By</h4>
                    
                <Button 
                    onClick={() => this.sortItems('name')} 
                    value='Name' disabled={this.state.sortBy === 'name'}/>
                <Button 
                    onClick={() => this.sortItems('description')} 
                    value='Description' disabled={this.state.sortBy === 'description'}/>
                <Button 
                    onClick={() => this.sortItems('valid')} 
                    value='Validity' disabled={this.state.sortBy === 'valid'}/>

            </div>
        );   
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))
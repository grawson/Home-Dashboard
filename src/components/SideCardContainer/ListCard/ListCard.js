import React from 'react'
import '../../../globals.css'
import './ListCard.css'
import { SideCardHeader } from '../SideCardHeader/SideCardHeader'
import { ListItem } from '../ListItem/ListItem'

export class ListCard extends React.Component {
    componentDidMount() {
        this.props.updateData()
        // update once a day
        this.interval = setInterval(this.props.updateData, (1000 * 60 * 60 * 24)) 
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    render() {
        let items;
        if (this.props.data.error)
            items = <span>{this.props.data.error.message}</span>
        else if (!this.props.data.isLoaded)
            items = <span>Loading...</span>
        else 
            items = this.props.data.items.map((e, idx) => <ListItem key={`e_${idx}`} name={e.title} details={e.details}/>)


        return (
            <div className='card'>
                <SideCardHeader title={this.props.data.title} />

                <div id='items-container' className='flexCol'>
                    {items}
                </div>
            </div>
        )
    }
}
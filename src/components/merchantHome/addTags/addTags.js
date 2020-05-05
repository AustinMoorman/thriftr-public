import React from 'react';

class AddTags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            tags: [],
            toManyTags: ''
        }
        this.key = this.key.bind(this)
        this.tags = this.tags.bind(this)
        this.deleteTag = this.deleteTag.bind(this)

    }
    key(event) {
        if (event.key === ' ' || event.key == 'Enter') {
            const tag = event.target.value.trim()
            let tags = this.state.tags
            if (tags.findIndex(thisTag => thisTag === tag) == -1 && tag) {
                if(tags.length <20){
                    tags.push(tag)
                    this.setState({ tags: tags })
                    this.props.updateTags(this.state.tags)
                }else{
                    this.setState({toManyTags:'you can only have 20 tags'})
                }
            }
            event.target.value = null;
        }
    }
    tags() {
        return this.state.tags.map(tag => {
            return (
                <div>
                    <p>{tag}</p>
                    <button onClick={this.deleteTag} name={tag}>x</button>
                </div>
            )
        })
    }
    deleteTag(event) {
        const tag = event.target.name;
        const tags = this.state.tags
        const index = tags.findIndex(thisTag => thisTag === tag)
        tags.splice(index, 1)
        this.setState({ tags: tags,toManyTags:''})
        this.props.updateTags(this.state.tags)
    }



    componentDidMount() {
        if(this.props.currentSelection){
            this.setState({tags: this.props.currentSelection})
        }
    }

    render() {
        return (
            <div>
                {this.tags()}
        <p>{this.state.toManyTags}</p>
                <input value={this.state.currentTag} onKeyPress={this.key}></input>
            </div>
        )
    }
}


export default AddTags;
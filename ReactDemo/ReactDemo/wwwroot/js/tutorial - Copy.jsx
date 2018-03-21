var data = [
    { id: 1, author: "Daniel Lo Nigro koo", text: "Hello ReactJS.NET World!" },
    { id: 2, author: "Pete Hunt koo", text: "This is one comment" },
    { id: 3, author: "Jordan Walke koo", text: "This is *another* comment" }
];

class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
}

class CommentList extends React.Component {
    render() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
}

class CommentForm extends React.Component {
    getInitialState() {
        return { author: '', text: '' };
    }
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!text || !author) {
            return;
        }
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit} >
                        <input
                            type="text"
                            placeholder="Your name"
                            value={this.state.author}
                            onChange={this.handleAuthorChange}
                        />
                        <input
                            type="text"
                            placeholder="Say something..."
                            value={this.state.text}
                            onChange={this.handleTextChange}
                        />
                        <input type="submit" value="Post" />
              </form>
        );
    }
}

class CommentBox extends React.Component{
    getInitialState() {
        return { data: [] };
    };
    loadCommentsFromServer() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    }
    handleCommentSubmit(comment) {
        var data = new FormData();
        data.append('author', comment.author);
        data.append('text', comment.text);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadCommentsFromServer();
        }.bind(this);
        xhr.send(data);
    }
    getInitialState() {
        return { data: [] };
    }
    componentDidMount() {
        this.loadCommentsFromServer();
        window.setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    }
    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.props.data.map} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
        );
    }
}

ReactDOM.render(
    <CommentBox url="/comments" submitUrl="/comments/new" pollInterval={2000} />,
    document.getElementById('content')
);
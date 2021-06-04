class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      total_amount: 1000,
      amount: 0,
      email: '',
    };
  }

  async componentDidMount(){
    const result = await axios.get('/get_total_amount');
    // console.log(result);
    // console.log(result.data[0].total_amount);
    this.setState({total_amount:result.data[0].total_amount});
  }

  onSubmit = async(event)=>{
    event.preventDefault();
    // alert(this.state.amount)
    //using axios to post data into db
    const response = await axios.post('/post_info', {
      amount: this.state.amount,
      email: this.state.email
    });
    window.location.href = response.data; //the code is use to catch return res.send(payment.links[i].href); inside server.js file
    // this.setState({amount: 0, email: ''}) //set input fields to default value back
    // console.log(response);
  }
  render(){
    return(
      <div className="container">
            <div className="col-md-12">
              <div className="card text-center">
                  <div className="card-header">
                    <h1>TOTAL WINNING POOL IS </h1>
                    <div className ="block">
                        <div className="circle">
                          <p>${this.state.total_amount}</p>
                        </div>
                    </div>
                  </div>
                  <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                      <div className="form-group">
                        <label >Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email"
                          onChange = {event=> this.setState({email :event.target.value})}
                        />
                        <small className="form-text text-muted">Well never share your email with anyone else.</small>
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <input type="number" className="form-control"  placeholder="Enter Amount"
                          value={this.state.amount}
                          onChange={event => this.setState({amount : event.target.value})}
                        />
                        <small className="form-text text-muted">Enter the amount you would like to participate with</small>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  </div>
              </div>
            </div>
        </div>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('reactBinding'));

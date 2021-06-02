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
      <div>
        <h1>LOTTERY APPLICATION WEB 2.0!</h1>
        <div>
          <p>Total lottery amount is {this.state.total_amount}</p>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            placeholder="amount"
            value={this.state.amount}
            onChange={(event)=>this.setState({amount: event.target.value})}
          />
          <input
            placeholder="email"
            value={this.state.email}
            onChange={(event)=>this.setState({email: event.target.value})}
          />
          <button type="submit">Participate</button>
        </form>
      </div>
    )
  }
};

ReactDOM.render(<App />, document.getElementById('reactBinding'));

const Quote = ({quote, votes}) => {
  return (
    <div>
      <p>{quote}</p>
      <p>has {votes} votes</p>
    </div>
  )
};

export default Quote;
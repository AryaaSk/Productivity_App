export const Button = (props: { count: number, handler: any }) => {
    return (
      <button id='newButton' onClick={props.handler}>{props.count}</button>
    )
}
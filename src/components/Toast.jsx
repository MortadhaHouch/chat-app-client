/* eslint-disable react/prop-types */
export default function Toast(props) {
    return (
        <div className={`toast ${props.isShown?"shown":"hidden"}`}>
            {
                props.message && props.message.length !== 0 && (
                    <p className="text-success">{props.message}</p>
                )
            }
            {
                props.error && props.error.length !== 0 && (
                    <p className="text-danger">{props.error}</p>
                )
            }
        </div>
    )
}

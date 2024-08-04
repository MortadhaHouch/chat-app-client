/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
export default function Aside(props) {
    return (
        <aside className={`aside ${props.isShown?"shown":"hidden"}`}>
            {
                props.users && props.users.length !==0 ?(
                    props.users.map((item,index)=>{
                        return(
                            <div key={index}>
                                <p className="text-bg-info">
                                    {
                                        item.name
                                    }
                                </p>
                            </div>
                        )
                    })
                ):(
                    <p>no users are connected</p>
                )
            }
        </aside>
    )
}

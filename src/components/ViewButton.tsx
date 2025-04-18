import { Link } from "lucide-react";
let ViewButton =( props:{ display:string, size?:number , onClick: (e)=>void ,fontSize:number})=>{
    const copyContent = async (text:string) => {
        try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
        } catch (err) {
        console.error('Failed to copy: ', err);
        }
    }
    return (
        <button onClick={props.onClick} className="text-gray-500 hover:text-gray-700 cursor-pointer">
        <Link size={props.size} className="hover:cursor-pointer"/>
        <p style={{fontSize:props.fontSize}}>{props.display}</p>
        </button>
        )
}


export default ViewButton;
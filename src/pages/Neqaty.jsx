import NeqatyHome from "../components/NeqatyHome";
import NeqatyNavbar from "../components/NeqatyNavbar";

const Neqaty = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NeqatyNavbar />
            <NeqatyHome />
        </div>
    )
}

export default Neqaty;
import { Link, useLocation } from "react-router-dom"

const Breadcrumbs = () => {

    const location = useLocation();
    const { pathname } = location;
    console.log(pathname);
    return (
        <div>
            {
                pathname.split('/')?.map((path, index) => {
                    if (index === 0) {
                        return (
                            <Link to={path}>
                                <span key={index}>{path}</span>
                            </Link>
                        )
                    }
                    else {
                        return (
                            <Link to={path}>
                                <span key={index}>/{path}</span>
                            </Link>
                        )
                    }
                })
            }
        </div>
    )
}

export default Breadcrumbs
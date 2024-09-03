import { Suspense } from "react";
import UsersContentPage from "./_components/UsersContent";

const UsersPage = () => {

    return (
        <Suspense>
            <UsersContentPage/>
        </Suspense>
    )
}


export default UsersPage;
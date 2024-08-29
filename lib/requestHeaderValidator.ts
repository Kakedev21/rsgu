import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { isTokenExpired } from "./tokenValidator";


const RequestHeaderValidator = {

    authenticate: (req: NextRequest) => {
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer?.split(" ")[1];
        return !isTokenExpired(token as string);
    }
}

export default RequestHeaderValidator;
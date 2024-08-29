'use client'

import usePageLoader from '@/hooks/usePageLoader';
import LoadingOverlay from "react-loading-overlay-ts"
const PageLoader = () => {
    const pageLoader = usePageLoader();
    return (
        <LoadingOverlay
        active={pageLoader.loading}
        spinner
        text={pageLoader.description}
        >
        </LoadingOverlay>
    );
}
 
export default PageLoader;